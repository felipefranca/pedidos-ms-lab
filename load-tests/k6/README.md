# Projeto de Teste de Carga com k6

Este modulo adiciona ao monorepo uma base simples e pratica para teste de carga usando k6.

Pasta:

- [`load-tests/k6`](load-tests/k6)

## Objetivo

Testar o fluxo principal exposto pelo gateway:

- cadastro/login
- criacao de pedido
- listagem de pedidos

A ideia aqui e estudar carga no mesmo fluxo que voce ja esta aprendendo funcionalmente.

## Estrutura

- [`load-tests/k6/scripts/smoke.js`](load-tests/k6/scripts/smoke.js)
- [`load-tests/k6/scripts/auth-orders-load.js`](load-tests/k6/scripts/auth-orders-load.js)
- [`load-tests/k6/lib/config.js`](load-tests/k6/lib/config.js)
- [`load-tests/k6/lib/helpers.js`](load-tests/k6/lib/helpers.js)

## Como funciona

### `smoke.js`

Teste bem pequeno para validar que o ambiente esta respondendo:

- cria usuario de teste
- faz login
- cria pedido
- lista pedidos

Use esse script antes do teste de carga real.

### `auth-orders-load.js`

Teste de carga gradual usando `ramping-vus`.

Cada VU:

- autentica uma vez
- reaproveita seu token
- cria pedidos
- lista pedidos

## Variaveis uteis

- `BASE_URL` padrao: `http://localhost:8080`
- `TEST_PASSWORD` padrao: `pedidos123!`
- `VUS`
- `ITERATIONS`
- `START_VUS`
- `STAGE1_DURATION`
- `STAGE1_TARGET`
- `STAGE2_DURATION`
- `STAGE2_TARGET`
- `STAGE3_DURATION`
- `STAGE3_TARGET`
- `SLEEP_SECONDS`

## Rodar com k6 instalado localmente

### Smoke test no PowerShell

```powershell
cd <repo-root>
k6 run ./load-tests/k6/scripts/smoke.js
```

### Carga gradual no PowerShell

```powershell
cd <repo-root>
k6 run ./load-tests/k6/scripts/auth-orders-load.js
```

### Exemplo com parametrizacao

```powershell
cd <repo-root>
$env:BASE_URL='http://localhost:8080'
$env:STAGE1_TARGET='10'
$env:STAGE2_TARGET='25'
$env:SLEEP_SECONDS='0.5'
k6 run ./load-tests/k6/scripts/auth-orders-load.js
```

### Smoke test no Bash, Git Bash ou WSL

```bash
cd <repo-root>
k6 run ./load-tests/k6/scripts/smoke.js
```

### Carga gradual no Bash, Git Bash ou WSL

```bash
cd <repo-root>
export BASE_URL='http://localhost:8080'
export STAGE1_TARGET='10'
export STAGE2_TARGET='25'
export SLEEP_SECONDS='0.5'
k6 run ./load-tests/k6/scripts/auth-orders-load.js
```

### Runners prontos do projeto

PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/run-k6.ps1 -Scenario smoke
powershell -ExecutionPolicy Bypass -File ./scripts/run-k6.ps1 -Scenario load
```

Bash:

```bash
bash ./scripts/run-k6.sh --scenario smoke
bash ./scripts/run-k6.sh --scenario load
```

## Rodar com Docker sem instalar k6

```powershell
docker run --rm -i --network host -v "<repo-root>:/workspace" grafana/k6 run /workspace/load-tests/k6/scripts/smoke.js
```

Se `--network host` nao funcionar bem no seu Docker Desktop, use o gateway exposto no host mesmo e ajuste `BASE_URL` para `http://host.docker.internal:8080`.

Exemplo:

```powershell
docker run --rm -i -e BASE_URL=http://host.docker.internal:8080 -v "<repo-root>:/workspace" grafana/k6 run /workspace/load-tests/k6/scripts/auth-orders-load.js
```

## O que observar nos resultados

Campos mais importantes do k6:

- `http_req_duration`: tempo das requisicoes
- `http_req_failed`: taxa de erro
- `p(95)`: comportamento de cauda mais importante que media simples
- `iterations` e `vus`: volume real gerado

## Observacao sobre pratica de mercado

Para automacao em shell/Linux, o mercado costuma seguir um destes caminhos:

- `curl + jq` para smoke scripts simples
- `k6`, `newman` ou outra ferramenta dedicada para smoke e carga
- testes de integracao na propria stack da aplicacao, por exemplo `RestAssured`, `pytest` ou equivalentes

Neste projeto, o smoke funcional do script Bash foi ajustado para usar `k6`, o que deixa a automacao mais portavel e evita depender de Python so para ler JSON.

## Sequencia recomendada de estudo

1. Suba o ambiente com Docker Compose.
2. Rode `smoke.js`.
3. Rode um teste de carga pequeno.
4. Observe Grafana, Prometheus e logs.
5. Aumente a carga gradualmente.
6. Compare comportamento com 1 instancia e depois com servicos escalados.

## Observacao importante

Esse projeto e voltado para estudo e baseline funcional. Para maturidade maior, os proximos passos naturais seriam:

- cenarios separados por endpoint
- thresholds por grupo
- tags e dashboards dedicados
- execucao via CI performance job
- testes com taxa constante e modelos mais proximos de producao




