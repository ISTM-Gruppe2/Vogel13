# Test-Skript: Workflow 1 - Interview Feedback Summary
# Simuliert den ERPNext Webhook mit dem vollstaendigen Payload
#
# WICHTIG: Job Applicant ID = E-Mail Adresse (z.B. lea.mueller@techmail.de)
#
# Verwendung:
#   .\test_webhook_1.ps1
#   .\test_webhook_1.ps1 -JobApplicant "max.mustermann@techmail.de" -Result "Rejected"
#   .\test_webhook_1.ps1 -Local

param(
    [string]$JobApplicant    = "lea.mueller@techmail.de",
    [string]$InterviewRound  = "Screening und Kennenlernen",
    [string]$Result          = "Cleared",
    [double]$AverageRating   = 0.79,
    [string]$FeedbackText    = "Gesamteindruck: positiv, sympathisch, vorbereitet. UDEC Website gelesen (gut!)\n\nStaerken:\n- Wechsel Telekom->UDEC plausibel (mehr Cloud)\n- 65k im Budget\n- Start 1.3.26 passt\n- Gute Fragen zu Team/Projekten\n- Deutsch ok, kleiner Akzent\n- Authentisch\n\nSchwaechen:\n- Karriereziele vage (mal schauen) - unsicher?\n- Nur 1 technische Frage gestellt (Tech-Stack) - wenig Interesse oder nervoes?\n- Luecke Okt-Dez 2024 persoenliche Auszeit - nachhaken in Runde 2!\n\nKultur: Werte passen (Vertrauen, Eigenverantwortung), collaborativ, Humor ok\n\nLogistik: 3 Tage Remote, 01.03., 65k, 30 Tage Urlaub\n\nWeiter zu Runde 2",
    [string]$InterviewId     = "HR-INT-2026-0009",
    [string]$FeedbackId      = "HR-INT-FEED-0001",
    [string]$N8nUrl          = "https://pia-web.ris.uni-due.de/n8n/webhook-test/interview-feedback-completed",
    [switch]$Local
)

if ($Local) {
    $N8nUrl = "http://localhost:5678/webhook/interview-feedback-completed"
}

$payload = @{
    job_applicant      = $JobApplicant
    interview          = $InterviewId
    interview_round    = $InterviewRound
    name               = $FeedbackId
    result             = $Result
    feedback           = $FeedbackText
    skill_assessment   = @(
        @{ skill = "Motivation";                    rating = 0.8 },
        @{ skill = "Kommunikationsfähigkeit";       rating = 0.9 },
        @{ skill = "Kulturelle Passung";            rating = 0.7 },
        @{ skill = "Verfügbarkeit";                 rating = 0.8 },
        @{ skill = "Beruflicher Werdegang";         rating = 0.6 },
        @{ skill = "Sprachkenntnisse";              rating = 1.0 },
        @{ skill = "Selbstreflexion";               rating = 0.8 },
        @{ skill = "Fragen des Kandidaten";         rating = 0.7 }
    )
}

$body = $payload | ConvertTo-Json -Depth 3

Write-Host "=== Workflow 1 Test ===" -ForegroundColor Cyan
Write-Host "URL: $N8nUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Payload:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray
Write-Host ""
Write-Host "Sende..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri $N8nUrl -Method Post -Body $body -ContentType "application/json"
    Write-Host "Response: $response" -ForegroundColor Green
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
