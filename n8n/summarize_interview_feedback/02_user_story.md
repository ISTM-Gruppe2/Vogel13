# User Story: Interview Feedback Summarization

**AS A** Hiring Manager / Interviewer (der das Stellengesuch erstellt hat),  
**I WANT** eine automatische Zusammenfassung des Interview-Feedbacks nach jeder Interviewrunde,  
**SO THAT** ich eine klare, strukturierte Entscheidungsgrundlage für den Hiring-Prozess habe und den Kandidaten schnell bewerten kann.

---

## Acceptance Criteria

### Runde 1 – Screening-Interview

- [ ] **Trigger:** Webhook (`POST /start-interview-feedback-summary`) – wird von ERPNext aufgerufen, sobald ein Screening-Interview-Feedback abgeschlossen ist
- [ ] **Filter:** Nur Interviews vom Typ „Screening" werden verarbeitet; alle anderen Runden brechen mit einem Error ab
- [ ] **Datenaggregation (`aggregate_data`):** Extrahiert `job_applicant` (Kandidaten-ID), `result`, `feedback`, `skill_assessment` (inkl. Skill-Name und Rating), `interview_round`, `interview_id`, `feedback_id`
- [ ] **Feedback-Parsing:** Parst das freie Feedback in Abschnitte (Gesamteindruck, Stärken, Schwächen, Kultur, Logistik) für strukturierte LLM-Eingabe
- [ ] **Skill-Bewertungen:** Berechnet den Durchschnitts-Rating-Wert aller bewerteten Skills und formatiert die Skills als Textliste (`Skillname: Rating`)
- [ ] **Kandidatenabfrage (`get_applicant_name`):** Ruft Kandidatenstammdaten, Consent-Status, CV-Daten, Skills und beruflichen Werdegang aus ERPNext ab
- [ ] **Stellenanforderung (`get_job_opening`):** Ruft die Stellenbeschreibung aus dem Job Opening ab (optional – Workflow läuft ohne weiter)
- [ ] **Interview-Details (`get_interview`):** Ruft Interview-Datum und Interviewer-Namen aus dem Interview-Doctype ab (optional)
- [ ] **Consent-Prüfung (`enrich_data`):** Validiert DSGVO-Scoring-Zustimmung (`custom_dsgvo_scoring_zustimmung`) und Datenschutzhinweis (`custom_datenschutzhinweis_bewerber`); bricht mit Fehler ab, falls nicht erteilt
- [ ] **Datenanreicherung:** Füllt Kandidatenname, CV-Zusammenfassung, CV-Skills, beruflichen Werdegang, Stellenbeschreibung und Interview-Metadaten in den LLM-Kontext ein
- [ ] **LLM-Prompt:** Englischsprachiger Prompt (Systemrolle: HR-Experte) mit Anweisung zur Ausgabe in deutscher Sprache
- [ ] **LLM-Zusammenfassung:** Erzeugt einen deutschen Fließtext (100–200 Wörter) mit Gesamteindruck (inkl. Abgleich mit CV und Stellenanforderungen), wichtigsten Stärken und wichtigsten Schwächen/Risiken
- [ ] **LLM-Modell:** Tencent Hunyuan via OpenRouter (`tencent/hy3:free`)
- [ ] **LLM-Ausgabe:** Nur reiner Text – kein Markdown, kein JSON
- [ ] **Aufbereitung (`parse_and_format`):** Entfernt etwaige Markdown-Fences aus dem LLM-Output; fügt Metadaten-Header hinzu (Interview-ID, Datum, Erstellt am, Interviewer); hängt das Screening-Ergebnis an den Summary-Text an:
  - `cleared` → „Weiter zu Runde 2."
  - andernfalls → „Kein Weiterkommen."
- [ ] **History-Archivierung:** Falls bereits eine Zusammenfassung existiert, wird diese als JSON-String in `custom_interview_summary_history` archiviert (Version, Datum, alter Summary-Text, alte Skill-Tabelle)
- [ ] **Skill-Tabelle:** Erstellt aus den Rohdaten eine strukturierte Skill-Assessment-Tabelle (`[ { skill, rating }, ... ]`)
- [ ] **ERPNext-Speicherung:** PUT-Request an `https://grp03.pia-web.ris.uni-due.de/api/resource/Job%20Applicant/{applicant_id}` mit folgenden Feldern:
  - `custom_interview_summary` – der aufbereitete Fließtext inkl. Metadaten-Header und Ergebniszeile
  - `custom_skill_assessment` – die Skill-Assessment-Tabelle
  - `custom_screening_feedback` – die Feedback-ID des Interviews
  - `custom_interview_summary_history` – (optional) History-Eintrag bei erneuter Verarbeitung
- [ ] **Sprache:** Alle LLM-Ausgaben sind auf Deutsch; der Prompt ist auf Englisch

### Runde 2 – Fach- & Fit-Gespräch

- [ ] **Trigger:** Webhook (`POST /complete-interview-summary`) – wird von ERPNext aufgerufen, sobald ein Fach- & Fit-Gespräch-Feedback abgeschlossen ist
- [ ] **Filter:** Nur Interviews vom Typ „Fach-" werden verarbeitet; alle anderen Runden brechen mit einem Error ab
- [ ] **Datenaggregation (`aggregate_data_r2`):** Extrahiert gleiche Felder wie R1, zusätzlich die originale Positionsbezeichnung aus dem Payload
- [ ] **Feedback-Parsing:** Parst das freie Feedback in Abschnitte (identisch zu R1)
- [ ] **Skill-Bewertungen:** Berechnet Durchschnitts-Rating und formatiert Skills als Textliste
- [ ] **R1-Daten abrufen (`fetch_round1_data`):** Ruft den bestehenden Job-Applicant-Datensatz inkl. R1-Summary, R1-Skills, CV-Daten und Consent-Status ab
- [ ] **Stellenanforderung (`get_job_opening_r2`):** Ruft Stellenbeschreibung ab (optional)
- [ ] **Interview-Details (`get_interview_r2`):** Ruft Interview-Datum und Interviewer-Namen ab (optional)
- [ ] **Konsolidierung (`aggregate_r1_r2`):**
  - Validiert DSGVO-Scoring-Zustimmung und Datenschutzhinweis (bricht ab, falls fehlend)
  - Validiert, dass eine R1-Zusammenfassung existiert (bricht ab, falls nicht)
  - Validiert, dass der Kandidat R1 bestanden hat (Prüfung auf „Weiter zu Runde 2" im Summary-Text)
  - Führt R2-Daten mit R1-Summary, R1-Skills, CV-Daten (Zusammenfassung, Skills, Werdegang), Stellenbeschreibung und Interview-Metadaten zusammen
  - Prüft auf bestehende technische Zusammenfassung für History-Archivierung
- [ ] **LLM-Prompt:** Englischsprachiger Prompt (Systemrolle: HR-Experte) mit Anweisung zur Ausgabe in deutscher Sprache; fordert einen strukturierten Bericht (250–400 Wörter) mit 5 Abschnitten: Gesamteindruck, Vergleich R1 vs. R2, Stärken, Schwächen/Risiken, finale Empfehlung
- [ ] **LLM-Modell:** Tencent Hunyuan via OpenRouter (`tencent/hy3:free`)
- [ ] **LLM-Ausgabe:** Nur reiner Text (Abschnittsüberschriften erlaubt), kein JSON, kein Markdown
- [ ] **Aufbereitung (`parse_and_format_r2`):** Entfernt Markdown-Fences; fügt Metadaten-Header hinzu; hängt Abschluss-Ergebnis an:
  - `cleared` → „Einstellung empfohlen."
  - andernfalls → „Keine Einstellungsempfehlung."
- [ ] **History-Archivierung:** Falls bereits eine technische Zusammenfassung existiert, wird diese in `custom_summary_technical_history` archiviert
- [ ] **ERPNext-Speicherung:** PUT-Request an `https://grp03.pia-web.ris.uni-due.de/api/resource/Job%20Applicant/{applicant_id}` mit folgenden Feldern:
  - `custom_summary_technical` – der aufbereitete Bericht inkl. Metadaten-Header und Ergebniszeile
  - `custom_skill_assessment_technical` – die Skill-Assessment-Tabelle
  - `custom_hard_and_softskills_feedback` – die Feedback-ID des Interviews
  - `custom_summary_technical_history` – (optional) History-Eintrag bei erneuter Verarbeitung
- [ ] **Sprache:** Alle LLM-Ausgaben sind auf Deutsch; der Prompt ist auf Englisch

### Technische Anforderungen

- [ ] **ERPNext Integration:** HTTP GET/PUT Requests mit Basic-Auth über ERPNextApi-Credentials
- [ ] **Fehlerbehandlung:** Beide Workflows brechen ab, wenn der eingegangene Interview-Typ nicht dem erwarteten Typ entspricht; R2 bricht zusätzlich ab bei fehlendem R1-Summary, nicht bestandener R1 oder fehlenden Consent
- [ ] **Performance:** Workflow läuft in unter 30 Sekunden durch

---

## Definition of Done

- [ ] Workflow „StartFeedback" für Runde 1 (Screening) ist implementiert (`StartFeedback.json`)
- [ ] Workflow „CompleteFeedback" für Runde 2 (Fach- & Fit-Gespräch) ist implementiert (`CompleteFeedback.json`)
- [ ] Webhook `/start-interview-feedback-summary` nimmt Screening-Feedback-Daten entgegen
- [ ] Webhook `/complete-interview-summary` nimmt Fach- & Fit-Gespräch-Feedback-Daten entgegen
- [ ] Nur Screening-Interviews werden von Workflow 1 verarbeitet; nur Fach-Interviews von Workflow 2
- [ ] R2 validiert, dass R1-Summary existiert und Kandidat bestanden hat
- [ ] DSGVO-Scoring-Zustimmung und Datenschutzhinweis werden in beiden Workflows geprüft
- [ ] LLM-Zusammenfassung (Hunyuan via OpenRouter) liefert validen deutschen Text
- [ ] ERPNext-Felder `custom_interview_summary`, `custom_skill_assessment`, `custom_screening_feedback` werden korrekt befüllt
- [ ] ERPNext-Felder `custom_summary_technical`, `custom_skill_assessment_technical`, `custom_hard_and_softskills_feedback` werden korrekt befüllt
- [ ] History-Archivierung (`custom_interview_summary_history` / `custom_summary_technical_history`) funktioniert bei erneuter Verarbeitung
- [ ] Testdaten (Dummy-Interviews) sind vorhanden
- [ ] Test-Skripte (PowerShell) zum Triggern beider Webhooks sind erstellt
- [ ] Code-Review ist durchgeführt
- [ ] Feature ist auf der Production-n8n-Instance deployed (`https://pia-web.ris.uni-due.de/n8n`)

---

## Dependencies

| Dependency | Status | Link |
|------------|--------|------|
| ERPNext HRMS Interview Doctype | Verfügbar | - |
| Custom-Felder in Job Applicant | Verfügbar | Fields.xlsx |
| n8n ERPNext API Credentials | Verfügbar | `erpNextApi` (trA9dhTurcxOP38C) |
| n8n OpenRouter Credentials | Verfügbar | `openRouterApi` (6bryUCpl9r04EdLI) |
| generate_interview_rounds Workflow | Implementiert | `features/generate_interview_rounds/` |

---

## Out of Scope (für zukünftige Stories)

- PRO/CONTRA-Tabelle im LLM-Output
- Boolean-Felder `boolean_hire` / `boolean_no_hire`
- Contract Preparation Modul
- Automatische Generierung von Vertragsentwürfen
- Benachrichtigungen per E-Mail an Hiring Manager
- E-Mail-Benachrichtigungen an Interviewer bei abgeschlossener Zusammenfassung

---

## Anmerkungen

- Custom Fields in Job Applicant: `custom_interview_summary`, `custom_skill_assessment`, `custom_screening_feedback` (R1) sowie `custom_summary_technical`, `custom_skill_assessment_technical`, `custom_hard_and_softskills_feedback` (R2) müssen in ERPNext als Custom Fields angelegt sein (siehe Fields.xlsx)
- Workflow 1 (StartFeedback) verarbeitet ausschließlich Screening-Interviews; Workflow 2 (CompleteFeedback) ausschließlich Fach- & Fit-Gespräche
- R2 setzt voraus, dass R1 bereits durchlaufen wurde und der Kandidat bestanden hat – der Workflow prüft dies anhand des `custom_interview_summary`-Felds
- Beide Workflows prüfen die DSGVO-Scoring-Zustimmung und den Datenschutzhinweis, bevor die LLM-Verarbeitung startet
- Der LLM-Prompt ist auf Englisch verfasst, instruiert das Modell aber zur Ausgabe in deutscher Sprache
- Als LLM-Modell kommt Tencent Hunyuan (`tencent/hy3:free`) über OpenRouter zum Einsatz
- Die Feedback-Notizen der Interviewer werden in Abschnitte (Gesamteindruck, Stärken, Schwächen, Kultur, Logistik) geparst, um strukturierte Eingabedaten für das LLM zu erzeugen
- Bei erneuter Verarbeitung (z. B. erneutes Feedback) wird die vorherige Zusammenfassung automatisch in einem History-Feld archiviert
