# User Story: Automatisches Bewerber-Scoring anhand von Job-Anforderungen

**AS A** HR-Analyst / Recruiter,  
**I WANT** dass das System Bewerberdaten aus dem Job Applicant mit den Stellenanforderungen aus dem Job Opening abgleicht und einen standardisierten Scoring-Report erzeugt,  
**SO THAT** ich die Kandidatenbewertung transparent, nachvollziehbar und automatisiert in ERPNext speichern kann.

---

## Ausgangssituation

Im bestehenden ERPNext-Prozess liegen bereits folgende Daten vor:
- `Job Applicant` mit CV-Zusammenfassung, Skills, Berufserfahrung und parsed JSON aus `custom_json_cv_parsing`
- `Job Opening` mit `custom_requirements_profil` und `custom_temperature`
- Das Scoring soll als `custom_score`, `custom_kurzfassung` und `custom_bewertungen` im Job Applicant abgelegt werden

Bisher werden Bewerberbewertungen manuell oder halbautomatisch durchgeführt. Die neue Lösung soll die Zuordnung von Bewerberprofil zu Stellenanforderung vereinheitlichen und die Ergebnisse direkt im ERPNext-Datensatz hinterlegen.

---

## Ziel

Der n8n-Workflow `ApplicantScoring` bewertet Bewerberdaten automatisch anhand von Job-Anforderungen.

Der Prozess läuft in dieser Reihenfolge:

1. **Trigger:** Workflow wird von einem vorgelagerten Prozess mit Bewerberdaten gestartet
2. **Job-Anforderungen laden:** Das Job Opening liefert `custom_requirements_profil` und `custom_temperature`
3. **Bewerberdaten bereitstellen:** Der Bewerberdatensatz aus `custom_json_cv_parsing` wird in den LLM-Kontext übernommen
4. **LLM-Evaluation:** Ein HR-Evaluator-LLM analysiert Anforderungen und Lebenslauf
5. **Score berechnen:** Das Ergebnis wird nach Wichtigkeit gewichtet und der finale Bewerberscore ermittelt
6. **ERPNext aktualisieren:** `custom_score`, `custom_kurzfassung` und `custom_bewertungen` werden im Job Applicant gespeichert

---

## Workflow (n8n)

```
When Executed by Another Workflow
  → HTTP Request get Job_Requirements
  → Merge Job_Requirements and Applicant Data
  → Basic LLM Chain
  → Code in JavaScript
  → Update Scoring
```

---

## Acceptance Criteria

- [ ] **AC 1 – Trigger:** Der Workflow startet aus einem vorgelagerten Workflow und verwendet `When Executed by Another Workflow`
- [ ] **AC 2 – Job-Anforderungen:** `custom_temperature` und `custom_requirements_profil` werden aus dem Job Opening geladen
- [ ] **AC 3 – Bewerberdaten:** Die CV-Daten werden aus `custom_json_cv_parsing` des Job Applicant übernommen
- [ ] **AC 4 – LLM Prompt:** Der LLM-Prompt ist eine strikte HR-Evaluator-Anweisung und fordert eine gültige deutsche JSON-Antwort ohne Text außerhalb des JSON
- [ ] **AC 5 – JSON-Ausgabe:** Die LLM-Ausgabe enthält zwingend `applicant_first_name`, `applicant_last_name`, `applicant_email`, `jobs_title`, `evaluation_summary` und `criteria_evaluation`
- [ ] **AC 6 – Kriterienbewertung:** Jedes Requirement wird unabhängig bewertet mit `req_score` aus {0, 25, 50, 75, 100}
- [ ] **AC 7 – Nachvollziehbarkeit:** `evidence_from_cv` beschreibt ausführlich, warum die Bewertung zustande kam
- [ ] **AC 8 – Score-Berechnung:** Der finale Score wird gewichtete aus `must-have`, `should-have` und `nice-to-have` berechnet
- [ ] **AC 9 – ERPNext-Speicherung:** PUT-Request an `https://grp03.pia-web.ris.uni-due.de/api/resource/Job Applicant/{email_id}` schreibt `custom_score`, `custom_kurzfassung` und `custom_bewertungen`
- [ ] **AC 10 – Struktur:** `custom_bewertungen` enthält eine sortierte Übersicht der Kriterien nach Wichtigkeit und Punktewert
- [ ] **AC 11 – Credentials:** Der Workflow verwendet `erpNextApi` und `openRouterApi`

---

## Definition of Done

- [ ] Der Workflow `ApplicantScoring.json` ist implementiert und aktiv
- [ ] Der Workflow verarbeitet Bewerberdaten aus einem vorgelagerten Prozess
- [ ] Der LLM-Output wird als gültiges deutsches JSON akzeptiert
- [ ] `custom_score`, `custom_kurzfassung` und `custom_bewertungen` werden im Job Applicant aktualisiert
- [ ] Die Score-Berechnung wurde gemäß Gewichtung validiert
- [ ] Die Speicherung erfolgt per PUT in ERPNext
- [ ] Es gibt eine klare Dokumentation des Scoring-Prozesses

---

## Dependencies

| Dependency | Status | Link |
|------------|--------|------|
| ERPNext Job Opening Doctype | Vorhanden | - |
| ERPNext Job Applicant Custom Fields | Vorhanden | `custom_score`, `custom_kurzfassung`, `custom_bewertungen` |
| n8n ERPNext API Credentials | Vorhanden | `erpNextApi` (trA9dhTurcxOP38C) |
| n8n OpenRouter Credentials | Vorhanden | `openRouterApi` (GnI3LwT9giGC7g1N) |
| Applicant CV Parsing Workflow | Vorhanden | `n8n/applicant_cv_parsing/ApplicantCVParsing.json` |

---

## Out of Scope

- Automatische Einladung oder Absage von Kandidaten
- Entscheidungsempfehlungen außerhalb des numerischen Scores
- Generierung von Interview-Terminen oder E-Mails
- Erweiterte Talent-Pipeline-Logik

---

## Anmerkungen

- Die Auswertung erfolgt auf Basis von klaren `must-have`, `should-have` und `nice-to-have` Gewichtungen
- Der LLM-Prompt muss eine reine JSON-Antwort ohne zusätzlichen Text liefern
- `custom_bewertungen` dient als nachvollziehbare Bewertungsquelle im Job Applicant
- Das Workflow-Design trennt die Datenbeschaffung (`Job_Requirements`, `Applicant`) von der Scoring-Logik
