#!/usr/bin/env bash

set -euo pipefail

REBUILD=false
KEEP_RUNNING=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --rebuild)
      REBUILD=true
      shift
      ;;
    --keep-running)
      KEEP_RUNNING=true
      shift
      ;;
    *)
      echo "Argumento invalido: $1" >&2
      echo "Uso: ./scripts/up-and-test.sh [--rebuild] [--keep-running]" >&2
      exit 1
      ;;
  esac
done

PYTHON_BIN="$(command -v python3 || command -v python || true)"
if [[ -z "${PYTHON_BIN}" ]]; then
  echo "python3/python nao encontrado. Este script usa Python apenas para ler JSON das respostas HTTP." >&2
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

STATUS_CODE=""
RESPONSE_BODY=""

write_step() {
  printf '\n==> %s\n' "$1"
}

json_get() {
  local file_path="$1"
  local key="$2"
  "${PYTHON_BIN}" - "$file_path" "$key" <<'PY'
import json
import sys

file_path, key = sys.argv[1], sys.argv[2]
with open(file_path, encoding="utf-8") as fh:
    data = json.load(fh)

value = data
for part in key.split("."):
    if isinstance(value, dict):
        value = value.get(part)
    else:
        value = None
        break

if value is None:
    sys.exit(1)

if isinstance(value, (dict, list)):
    print(json.dumps(value))
else:
    print(value)
PY
}

json_len() {
  local file_path="$1"
  "${PYTHON_BIN}" - "$file_path" <<'PY'
import json
import sys

with open(sys.argv[1], encoding="utf-8") as fh:
    data = json.load(fh)

print(len(data))
PY
}

request() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local token="${4:-}"
  local output_file="${TMP_DIR}/response.json"

  local curl_args=(
    -sS
    -o "$output_file"
    -w "%{http_code}"
    -X "$method"
    -H "Accept: application/json"
  )

  if [[ "$method" != "GET" ]]; then
    curl_args+=(-H "Content-Type: application/json")
  fi

  if [[ -n "$token" ]]; then
    curl_args+=(-H "Authorization: Bearer ${token}")
  fi

  if [[ -n "$data" ]]; then
    curl_args+=(--data "$data")
  fi

  STATUS_CODE="$(curl "${curl_args[@]}" "$url")"
  RESPONSE_BODY="$output_file"
}

wait_for_url() {
  local url="$1"
  local timeout_seconds="${2:-240}"
  local start_time
  start_time="$(date +%s)"

  while true; do
    local http_code
    http_code="$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)"
    if [[ "$http_code" =~ ^[0-9]+$ ]] && (( http_code >= 200 && http_code < 500 )); then
      return 0
    fi

    if (( $(date +%s) - start_time >= timeout_seconds )); then
      echo "Timeout esperando URL: $url" >&2
      exit 1
    fi

    sleep 5
  done
}

assert_healthy() {
  local url="$1"
  request GET "$url"
  local status
  status="$(json_get "$RESPONSE_BODY" "status")"
  if [[ "$status" != "UP" ]]; then
    echo "Healthcheck falhou em $url" >&2
    exit 1
  fi
}

retry_request() {
  local attempts="$1"
  shift
  local delay_seconds="${1:-5}"
  shift

  local attempt
  for (( attempt=1; attempt<=attempts; attempt++ )); do
    if "$@"; then
      return 0
    fi
    if (( attempt == attempts )); then
      return 1
    fi
    sleep "$delay_seconds"
  done
}

register_user() {
  request POST "http://localhost:8080/api/auth/register" "$REGISTER_BODY"
  [[ "$STATUS_CODE" == "201" || "$STATUS_CODE" == "200" ]]
}

login_user() {
  request POST "http://localhost:8080/api/auth/login" "$LOGIN_BODY"
  [[ "$STATUS_CODE" == "200" ]]
}

create_order() {
  request POST "http://localhost:8080/api/orders" "$ORDER_BODY" "$TOKEN"
  [[ "$STATUS_CODE" == "201" || "$STATUS_CODE" == "200" ]]
}

list_orders() {
  request GET "http://localhost:8080/api/orders" "" "$TOKEN"
  [[ "$STATUS_CODE" == "200" ]]
}

cd "$REPO_ROOT"

COMPOSE_ARGS=(compose up -d)
if [[ "$REBUILD" == "true" ]]; then
  COMPOSE_ARGS=(compose up --build -d)
fi

write_step "Subindo ambiente Docker Compose"
docker "${COMPOSE_ARGS[@]}"

write_step "Esperando endpoints principais"
wait_for_url "http://localhost:8888/actuator/health"
wait_for_url "http://localhost:8761"
wait_for_url "http://localhost:8081/actuator/health"
wait_for_url "http://localhost:8082/actuator/health"
wait_for_url "http://localhost:8083/actuator/health"
wait_for_url "http://localhost:8080/actuator/health"

write_step "Validando healthchecks"
assert_healthy "http://localhost:8888/actuator/health"
assert_healthy "http://localhost:8081/actuator/health"
assert_healthy "http://localhost:8082/actuator/health"
assert_healthy "http://localhost:8083/actuator/health"
assert_healthy "http://localhost:8080/actuator/health"

STAMP="$(date +%Y%m%d%H%M%S)"
EMAIL="codex.${STAMP}@playground.local"
PASSWORD="123456"

REGISTER_BODY=$(cat <<JSON
{"name":"Automation User","email":"${EMAIL}","password":"${PASSWORD}"}
JSON
)

LOGIN_BODY=$(cat <<JSON
{"email":"${EMAIL}","password":"${PASSWORD}"}
JSON
)

ORDER_BODY='{"itemName":"Pedido Automacao","amount":199.90}'

write_step "Executando fluxo funcional via gateway"
retry_request 20 5 register_user || { echo "Falha ao registrar usuario." >&2; exit 1; }
retry_request 20 5 login_user || { echo "Falha ao autenticar usuario." >&2; exit 1; }
TOKEN="$(json_get "$RESPONSE_BODY" "accessToken")"
TOKEN_TYPE="$(json_get "$RESPONSE_BODY" "tokenType")"

retry_request 20 5 create_order || { echo "Falha ao criar pedido." >&2; exit 1; }
ORDER_ID="$(json_get "$RESPONSE_BODY" "id")"

retry_request 20 5 list_orders || { echo "Falha ao listar pedidos." >&2; exit 1; }
ORDERS_COUNT="$(json_len "$RESPONSE_BODY")"

write_step "Resumo da validacao"
cat <<EOF
Email: ${EMAIL}
TokenType: ${TOKEN_TYPE}
OrderId: ${ORDER_ID}
OrdersCount: ${ORDERS_COUNT}
SwaggerAuth: http://localhost:8081/swagger-ui/index.html
SwaggerOrders: http://localhost:8082/swagger-ui/index.html
KafkaUi: http://localhost:9080
Grafana: http://localhost:3000
EOF

if [[ "$KEEP_RUNNING" != "true" ]]; then
  write_step "Derrubando ambiente"
  docker compose down
else
  write_step "Ambiente mantido em execucao por solicitacao"
fi
