#!/usr/bin/env bash

set -euo pipefail

REBUILD=false
KEEP_RUNNING=false
BASE_URL="http://localhost:8080"

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
    --base-url)
      BASE_URL="$2"
      shift 2
      ;;
    *)
      echo "Argumento invalido: $1" >&2
      echo "Uso: ./scripts/up-and-test.sh [--rebuild] [--keep-running] [--base-url http://localhost:8080]" >&2
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

write_step() {
  printf '\n==> %s\n' "$1"
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
  local status
  status="$(curl -fsS "$url" | sed -n 's/.*"status":"\([^"]*\)".*/\1/p')"
  if [[ "$status" != "UP" ]]; then
    echo "Healthcheck falhou em $url" >&2
    exit 1
  fi
}

run_k6_smoke() {
  if command -v k6 >/dev/null 2>&1; then
    BASE_URL="$BASE_URL" k6 run "${REPO_ROOT}/load-tests/k6/scripts/smoke.js"
    return 0
  fi

  local mount_root="$REPO_ROOT"
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*)
      if command -v cygpath >/dev/null 2>&1; then
        mount_root="$(cygpath -w "$REPO_ROOT")"
      fi
      ;;
  esac

  docker run --rm \
    -e BASE_URL="$BASE_URL" \
    -v "${mount_root}:/workspace" \
    grafana/k6 run /workspace/load-tests/k6/scripts/smoke.js
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
wait_for_url "http://localhost:9080"
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

write_step "Executando smoke funcional via k6"
run_k6_smoke

write_step "Resumo da validacao"
cat <<EOF
BaseUrl: ${BASE_URL}
SmokeRunner: k6
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
