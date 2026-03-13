param(
    [string]$Scenario = 'smoke',
    [string]$BaseUrl = 'http://localhost:8080'
)

$root = 'C:\code_environment\workspace\pedidos-ms'
$scriptPath = switch ($Scenario) {
    'smoke' { '.\load-tests\k6\scripts\smoke.js' }
    'load' { '.\load-tests\k6\scripts\auth-orders-load.js' }
    default { throw "Cenario invalido: $Scenario. Use 'smoke' ou 'load'." }
}

$env:BASE_URL = $BaseUrl

Write-Host "Executando k6 scenario '$Scenario' contra $BaseUrl"
k6 run $scriptPath
