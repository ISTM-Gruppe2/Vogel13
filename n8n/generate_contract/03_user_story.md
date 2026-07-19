# User Story: Automatische Generierung von Job Offer & Vertrag

**AS A** HR Manager,
**I WANT** das System generiert automatisch ein Job Offer aus dem Applicant-Profil und den Interview-Feedbacks,
**SO THAT** ich Daten nicht manuell kopieren muss und das Job Offer nach Annahme des Kandidaten direkt als rechtsgültiger Vertrag dient.

---

## Ausgangssituation

ERPNext hat einen Job Offer DocType mit:
- `offer_terms` (Child Table) – individuelle Konditionen (Gehalt, Arbeitszeit, etc.)
- `terms` (HTML) – standardisierte T&C-Klauseln
- `job_applicant` – Link zum Bewerber

Bisher müssen alle Felder manuell befüllt werden. Die Daten liegen bereits im Applicant-Profil und in den Interview-Feedbacks, werden aber nicht genutzt.

Custom Fields auf Job Offer:
- `custom_generation_status` – Status der KI-Generierung ("AI Generated")
- `custom_source_tracking` – JSON-String, der pro offer_term die Quelle speichert

---

## Ziel

Ein n8n Webhook `/webhook/generate-contract` (bzw. `/webhook-test/generate-contract`) erzeugt auf Basis eines Applicant-Identifiers einen fertig befüllten Job Offer:

1. **Interview Feedback** (Priority 1) – Was wurde im Gespräch vereinbart? (Gehalt, Start, etc.)
2. **Applicant Profile** (Priority 2) – Was fehlt noch? (Position, Skills, Werdegang)
3. **Company Defaults** (Priority 3) – Feste Werte (Arbeitszeit, Probezeit, Urlaub)

Nach Annahme durch den Kandidaten wird der Job Offer **read-only** und erhält Signaturfelder – er ist dann der rechtsgültige Vertrag. Kein separater Contract-DocType.

---

## Workflow (n8n)

```
Webhook (POST /webhook/generate-contract)
  → extract_applicant_id: Extrahiert email_id aus Payload
  → fetch_applicant: Ruft Applicant via ERPNext REST API ab
  → aggregate_applicant_data: Baut strukturiertes JSON (Profil + Feedbacks + CV)
  → llm_chain (or_chat_model via OpenRouter): LLM extrahiert offer_terms
  → parse_and_build_job_offer: Validiert JSON, erzeugt ERPNext-konformes Job-Offer-Objekt
  → create_job_offer: POST an /api/resource/Job Offer (Status "Awaiting Response")
  → Rückgabe der Job-Offer-URL als Webhook-Response
```

---

## Acceptance Criteria

- [ ] **AC 1 – Webhook-Trigger:** Ein POST an `/webhook/generate-contract` mit `{"email_id": "<applicant-email>"}` startet die Generierung
- [ ] **AC 2 – Feedback first:** LLM extrahiert vereinbarte Konditionen aus allen Interview-Feedbacks (Gehalt, Start, AZ, Probezeit) und schreibt sie in die `offer_terms`
- [ ] **AC 3 – Profil als Fallback:** Fehlende Werte werden aus dem Applicant-Profil ergänzt (Position aus `designation`, Gehaltswunsch aus `lower_range`, etc.)
- [ ] **AC 4 – Defaults:** Für den Rest gelten Company Defaults (40h, 6 Monate Probezeit, 30 Tage Urlaub, 4 Wochen Kündigungsfrist, Arbeitsort Essen, Benefits, 13. Gehalt + Weihnachtsgeld)
- [ ] **AC 5 – Quellenangabe:** Pro offer_term wird die Quelle in `custom_source_tracking` (JSON-String) gespeichert: `"feedback"`, `"profile"`, `"default"` oder `"ai"`
- [ ] **AC 6 – T&C Template:** `select_terms: 'ihk-standard'` und `job_offer_term_template: 'Standard'` werden gesetzt
- [ ] **AC 7 – AI-Generated-Kennzeichnung:** `custom_generation_status` wird auf `"AI Generated"` gesetzt
- [ ] **AC 8 – Prüfung vor Versand:** HR kann alle AI-Werte sehen, Quellen einsehen und manuell überschreiben (via ERPNext-UI, nach Generierung)
- [ ] **AC 9 – Annahme = Vertrag:** Bei Status "Accepted" wird der Job Offer locked + Signaturfelder (`contract_date`, `signature_employer`, `signature_employee`) werden sichtbar
- [ ] **AC 10 – Kein separater Contract:** Der Job Offer selbst ist das finale Vertragsdokument

---

## Definition of Done

- [ ] Alle Akzeptanzkriterien sind erfüllt
- [ ] n8n Workflow (GenerateContract.json) ist deployed und aktiv
- [ ] Custom Fields auf Job Offer (`custom_generation_status`, `custom_source_tracking`) sind angelegt
- [ ] Testdaten sind vorhanden (`context/`-Verzeichnis)
- [ ] Test-Script (`test_webhook.ps1`) ist erstellt und getestet
- [ ] Webhook-Payload verwendet `email_id` (Key muss im Script und im extract_node übereinstimmen)
- [ ] Feature ist auf der n8n-Instance deployed