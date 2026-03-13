param(
    [switch]$Rebuild,
    [switch]$KeepRunning
)

$ErrorActionPreference = 'Stop'

function Write-Step($message) {
    Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Wait-ForUrl($url, $timeoutSeconds = 240) {
    $deadline = (Get-Date).AddSeconds($timeoutSeconds)
    do {
        try {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 10
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return $true
            }
        }
        catch {
            Start-Sleep -Seconds 5
        }
    } while ((Get-Date) -lt $deadline)

    throw "Timeout esperando URL: $url"
}

function Assert-Healthy($url) {
    $response = Invoke-RestMethod -Method Get -Uri $url -TimeoutSec 15
    if ($response.status -ne 'UP') {
        throw "Healthcheck falhou em $url"
    }
}

function Invoke-WithRetry {
    param(
        [scriptblock]$Action,
        [int]$MaxAttempts = 20,
        [int]$DelaySeconds = 5
    )

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            return & $Action
        }
        catch {
            if ($attempt -eq $MaxAttempts) {
                throw
            }
            Start-Sleep -Seconds $DelaySeconds
        }
    }
}

Set-Location $PSScriptRoot\..

$composeArgs = @('compose', 'up', '-d')
if ($Rebuild) {
    $composeArgs = @('compose', 'up', '--build', '-d')
}

Write-Step 'Subindo ambiente Docker Compose'
docker @composeArgs

Write-Step 'Esperando endpoints principais'
Wait-ForUrl 'http://localhost:8888/actuator/health' | Out-Null
Wait-ForUrl 'http://localhost:8761' | Out-Null
Wait-ForUrl 'http://localhost:8081/actuator/health' | Out-Null
Wait-ForUrl 'http://localhost:8082/actuator/health' | Out-Null
Wait-ForUrl 'http://localhost:8083/actuator/health' | Out-Null
Wait-ForUrl 'http://localhost:8080/actuator/health' | Out-Null

Write-Step 'Validando healthchecks'
Assert-Healthy 'http://localhost:8888/actuator/health'
Assert-Healthy 'http://localhost:8081/actuator/health'
Assert-Healthy 'http://localhost:8082/actuator/health'
Assert-Healthy 'http://localhost:8083/actuator/health'
Assert-Healthy 'http://localhost:8080/actuator/health'

$stamp = Get-Date -Format 'yyyyMMddHHmmss'
$email = "codex.$stamp@playground.local"
$password = '123456'

Write-Step 'Executando fluxo funcional via gateway'
$registerBody = @{ name = 'Automation User'; email = $email; password = $password } | ConvertTo-Json
$register = Invoke-WithRetry { Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/register' -ContentType 'application/json' -Body $registerBody }

$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
$login = Invoke-WithRetry { Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/login' -ContentType 'application/json' -Body $loginBody }
$token = $login.accessToken

$orderBody = @{ itemName = 'Pedido Automacao'; amount = 199.90 } | ConvertTo-Json
$order = Invoke-WithRetry { Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/orders' -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -Body $orderBody }
$list = Invoke-WithRetry { Invoke-RestMethod -Method Get -Uri 'http://localhost:8080/api/orders' -Headers @{ Authorization = "Bearer $token" } }

$result = [pscustomobject]@{
    Email = $email
    TokenType = $login.tokenType
    OrderId = $order.id
    OrdersCount = $list.Count
    SwaggerAuth = 'http://localhost:8081/swagger-ui/index.html'
    SwaggerOrders = 'http://localhost:8082/swagger-ui/index.html'
    KafkaUi = 'http://localhost:9080'
    Grafana = 'http://localhost:3000'
}

Write-Step 'Resumo da validacao'
$result | Format-List

if (-not $KeepRunning) {
    Write-Step 'Derrubando ambiente'
    docker compose down
}
else {
    Write-Step 'Ambiente mantido em execucao por solicitacao'
}