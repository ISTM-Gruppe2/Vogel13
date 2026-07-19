# Test-Script: Generate Interview Rounds Workflow
# Sendet eine POST-Anfrage an den n8n Webhook
#
# Verwendung:
#   .\test_webhook.ps1
#   .\test_webhook.ps1 -Local
#   .\test_webhook.ps1 -RequirementsFile "meine_anforderungen.json"
#   .\test_webhook.ps1 -JobId "HR-OPN-2026-0007" -JobTitle "Backend Engineer (C#) (m/w/d)" -RequisitionId "HR-HIREQ-00006" -Interviewer "HR-EMP-00097"

param(
    [string]$RequirementsFile,
    [string]$JobId = "HR-OPN-2026-0007",
    [string]$JobTitle = "Backend Engineer (C#) (m/w/d)",
    [string]$RequisitionId = "HR-HIREQ-00006",
    [string]$Interviewer = "HR-EMP-00097",
    [switch]$Local
)

# Ignore SSL certificate errors (for self-signed certs)
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

$N8N_BASE = "https://pia-web.ris.uni-due.de/n8n"

if ($Local) {
    $WebhookUrl = "http://localhost:5678/webhook/job_opening_web_hook"
}
else {
    $WebhookUrl = "${N8N_BASE}/webhook-test/job_opening_web_hook"
}

Write-Host "=== Generate Interview Rounds Test ===" -ForegroundColor Cyan
Write-Host "URL: $WebhookUrl" -ForegroundColor Yellow
Write-Host ""

# Load requirements
if (-not $RequirementsFile) {
    $requirementsPath = "$PSScriptRoot\context\requirements_example.json"
}
else {
    $requirementsPath = $RequirementsFile
}

Write-Host "Loading requirements file..." -ForegroundColor Yellow
Write-Host "Path: $requirementsPath"
Write-Host "File exists: $(Test-Path $requirementsPath)"

if (Test-Path $requirementsPath) {
    $requirementsFile = Get-Content -Path $requirementsPath -Raw -Encoding UTF8
    Write-Host "File loaded, size: $($requirementsFile.Length) chars"

    Write-Host "Parsing JSON..."
    $requirementsData = $requirementsFile | ConvertFrom-Json
    Write-Host "JSON parsed successfully" -ForegroundColor Green

    $JobId   = $requirementsData.job_id
    $JobTitle = $requirementsData.job_title
    Write-Host "Loaded job: $JobTitle ($JobId)" -ForegroundColor Green
}
else {
    Write-Host "File not found! Using default values." -ForegroundColor Yellow
    Write-Host "Job: $JobTitle ($JobId)" -ForegroundColor Yellow
}

Write-Host "`nBuilding request body..." -ForegroundColor Yellow

# Escape the requirements JSON for embedding in the webhook payload
$escapedRequirements = ($requirementsFile -replace '\\', '\\' -replace '"', '\"' -replace "`n", '\n' -replace "`r", '\r' -replace "`t", '\t')

$body = @"
{
  "name": "$JobId",
  "designation": "$JobTitle",
  "custom_job_requisition_id": "$RequisitionId",
  "custom_angefordert_von": "$Interviewer",
  "custom_requirements_profil": "$escapedRequirements"
}
"@

Write-Host "Body created, length: $($body.Length) chars" -ForegroundColor Green
Write-Host ""

Write-Host "Sending request..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 60
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
