param(
    [string]$Scenario = 'smoke',
    [string]$BaseUrl = 'http://localhost:8080'
)

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$scriptPath = switch ($Scenario) {
    'smoke' { Join-Path $root 'load-tests\k6\scripts\smoke.js' }
    'load' { Join-Path $root 'load-tests\k6\scripts\auth-orders-load.js' }
    default { throw "Cenario invalido: $Scenario. Use 'smoke' ou 'load'." }
}

if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
    throw 'k6 nao encontrado no PATH. Instale o k6 ou use a execucao via Docker descrita em load-tests/k6/README.md.'
}

$env:BASE_URL = $BaseUrl

Write-Host "Executando k6 scenario '$Scenario' contra $BaseUrl"
k6 run $scriptPath
