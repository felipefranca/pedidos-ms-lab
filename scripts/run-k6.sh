#!/usr/bin/env bash

set -euo pipefail

SCENARIO="smoke"
BASE_URL="http://localhost:8080"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -s|--scenario)
      SCENARIO="$2"
      shift 2
      ;;
    -b|--base-url)
      BASE_URL="$2"
      shift 2
      ;;
    *)
      echo "Argumento invalido: $1" >&2
      echo "Uso: ./scripts/run-k6.sh [--scenario smoke|load] [--base-url http://localhost:8080]" >&2
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

case "${SCENARIO}" in
  smoke)
    SCRIPT_PATH="${REPO_ROOT}/load-tests/k6/scripts/smoke.js"
    ;;
  load)
    SCRIPT_PATH="${REPO_ROOT}/load-tests/k6/scripts/auth-orders-load.js"
    ;;
  *)
    echo "Cenario invalido: ${SCENARIO}. Use 'smoke' ou 'load'." >&2
    exit 1
    ;;
esac

if ! command -v k6 >/dev/null 2>&1; then
  echo "k6 nao encontrado no PATH. Instale o k6 ou use a execucao via Docker descrita em load-tests/k6/README.md." >&2
  exit 1
fi

export BASE_URL

echo "Executando k6 scenario '${SCENARIO}' contra ${BASE_URL}"
k6 run "${SCRIPT_PATH}"
