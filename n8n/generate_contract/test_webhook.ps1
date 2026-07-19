# Test-Script: Generate Contract Workflow Trigger
# WICHTIG: Job Applicant ID = E-Mail Adresse (z.B. buax3x0rzh@ozsaip.com)
#
# Verwendung:
#   .\test_webhook.ps1 -ApplicantId "buax3x0rzh@ozsaip.com"
#   .\test_webhook.ps1 -ApplicantId "buax3x0rzh@ozsaip.com" -Production
#   .\test_webhook.ps1 -ApplicantId "buax3x0rzh@ozsaip.com" -Local

param(
    [Parameter(Mandatory=$true)]
    [string]$ApplicantId,
    [switch]$Production,
    [switch]$Local
)

# Ignore SSL certificate errors (for self-signed certs)
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

$N8N_BASE = "https://pia-web.ris.uni-due.de/n8n"

if ($Local) {
    $WebhookUrl = "http://localhost:5678/webhook/generate-contract"
}
elseif ($Production) {
    $WebhookUrl = "${N8N_BASE}/webhook/generate-contract"
}
else {
    $WebhookUrl = "${N8N_BASE}/webhook-test/generate-contract"
}

Write-Host "=== Generate Contract Test ===" -ForegroundColor Cyan
Write-Host "URL: $WebhookUrl" -ForegroundColor Yellow
Write-Host "Applicant ID: $ApplicantId" -ForegroundColor Yellow
Write-Host ""

$body = @{
    job_applicant_id = $ApplicantId
} | ConvertTo-Json

Write-Host "Payload:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray
Write-Host ""

Write-Host "Sending request..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
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