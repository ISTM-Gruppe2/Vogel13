# User Story: Automatische Generierung von Job Opening und Stellenausschreibung

**AS A** HR Manager / Hiring Manager,  
**I WANT** dass das System aus einem freigegebenen Stellengesuch automatisch eine passende Stellenanzeige und ein Job Opening erzeugt,  
**SO THAT** ich Stellenausschreibungen schneller, konsistenter und ohne manuelle Übertragung der Stammdaten veröffentlichen kann.

---

## Ausgangssituation

Im bestehenden ERPNext-Prozess liegt das Stellengesuch bereits mit den relevanten Ausgangsdaten vor, unter anderem:
- `designation` – Stellenbezeichnung
- `company` – Unternehmen
- `requested_by_dept` – anfordernde Abteilung
- `description` – Jobbeschreibung
- `expected_compensation` – erwartete Vergütung
- `custom_location` – Standort
- `custom_employment_type` – Beschäftigungsart

Bisher müssen aus diesen Daten die Stellenanzeige, die Gehaltsrange und das Job Opening manuell aufgebaut werden. Zusätzlich entstehen dabei mehrere mögliche Textvarianten, die separat gepflegt und später ausgewählt werden müssen.

Der Workflow generiert deshalb zunächst ein strukturiertes Requirements-Profil und anschließend drei unterschiedliche Textvarianten für die Stellenanzeige:
- **Enterprise** – formal, detailliert und corporate-orientiert
- **Modern** – modern, technologieorientiert und kandidatennah
- **Compact** – kurz, klar und auf die wichtigsten Informationen reduziert

Nach der Variantenwahl wird das Job Opening in ERPNext erstellt, die gewählte Variante gespeichert und der Status des Stellengesuchs auf `Open & Approved` gesetzt.

---

## Ziel

Ein n8n-Webook `/webhook/stellengesuch-trigger` erzeugt auf Basis eines Stellengesuchs automatisch eine veröffnungsfähige Stellenanzeige und ein ERPNext-Job-Opening.

Der Prozess läuft in dieser Reihenfolge:

1. **Stellengesuch laden** – ERPNext-Datensatz wird per API abgefragt
2. **Gehaltsrange berechnen** – aus `expected_compensation` wird eine Range von 80 % bis 120 % berechnet und auf Tausender gerundet
3. **Requirements-Profil extrahieren** – LLM erzeugt ein strukturiertes JSON mit validierten Kategorien und Gewichtungen
4. **Varianten erzeugen** – drei HTML-Stellenanzeigen in unterschiedlichen Stilrichtungen werden erstellt
5. **Variante validieren und auswählen** – ausgewählte Variante wird übernommen
6. **Job Opening erstellen** – ERPNext-Job-Opening wird mit allen relevanten Feldern angelegt
7. **Status aktualisieren** – Job Description Variant wird auf `Published` gesetzt und das Stellengesuch auf `Open & Approved`

---

## Workflow (n8n)

```
Webhook (POST /stellengesuch-trigger)
  → Stellengesuch laden
  → Gehaltsrange berechnen
  → Requirements extrahieren
  → Variante Enterprise / Modern / Compact
  → Merge & Validate
  → Varianten in ERPNext speichern
  → Webhook /variante-ausgewaehlt
  → Variant mit Auswahl laden
  → Gewählte Variante auswählen
  → Job Opening erstellen
  → Variant Status updaten
  → Stellengesuch Status updaten
```

---

## Acceptance Criteria

- [ ] **AC 1 – Webhook-Trigger:** Ein POST an `/webhook/stellengesuch-trigger` startet den Workflow auf Basis eines Stellengesuchs
- [ ] **AC 2 – Datenübernahme:** Die Felder `designation`, `company`, `requested_by_dept`, `description`, `expected_compensation`, `custom_location` und `custom_employment_type` werden aus ERPNext geladen
- [ ] **AC 3 – Gehaltsrange:** Aus `expected_compensation` wird automatisch eine Range von 80 % bis 120 % berechnet und auf den nächsten Tausender aufgerundet
- [ ] **AC 4 – Requirements-Profil:** Das LLM erzeugt ausschließlich ein gültiges JSON-Requirements-Profil mit den erlaubten Kategorien und ohne frei erfundene Anforderungen
- [ ] **AC 5 – Varianten:** Für jedes Stellengesuch werden drei HTML-Varianten erzeugt: `Enterprise`, `Modern` und `Compact`
- [ ] **AC 6 – HTML-Regeln:** Die Varianten verwenden nur die erlaubten HTML-Tags (`h3`, `p`, `ul`, `li`, `strong`) und enthalten keine Markdown-Ausgabe
- [ ] **AC 7 – Variantenwahl:** Nach Auswahl wird genau die gewählte Variante für das Job Opening verwendet
- [ ] **AC 8 – Job Opening:** Ein ERPNext-Job-Opening wird mit Titel, Beschreibung, Anforderungen, Standort, Beschäftigungsart, Gehaltsrange und Status `Open` erstellt
- [ ] **AC 9 – Statuspflege:** Die gewählte Job Description Variant wird auf `Published` gesetzt
- [ ] **AC 10 – Stellengesuch-Freigabe:** Das ursprüngliche Stellengesuch wird nach erfolgreicher Erstellung auf `Open & Approved` gesetzt
- [ ] **AC 11 – Nachvollziehbarkeit:** Das generierte Requirements-Profil wird gespeichert und kann für spätere Schritte weiterverwendet werden

---

## Definition of Done

- [ ] Der Workflow `GenerateJobOpening.json` ist implementiert und aktiv
- [ ] Der Webhook `/stellengesuch-trigger` ist erreichbar
- [ ] Die drei Stellenanzeigen-Varianten werden korrekt erzeugt
- [ ] Das Requirements-Profil wird validiert und in ERPNext persistiert
- [ ] Das Job Opening wird mit allen Pflichtfeldern erstellt
- [ ] Die Statusupdates für Job Description Variant und Stellengesuch funktionieren
- [ ] Testdaten und ein Test-Script für den Webhook sind vorhanden
- [ ] Die erzeugte Stellenanzeige kann manuell geprüft und anschließend veröffentlicht werden

---

## Dependencies

| Dependency | Status | Link |
|------------|--------|------|
| ERPNext Job Requisition / Stellengesuch | Vorhanden | - |
| ERPNext Job Opening Doctype | Vorhanden | - |
| n8n ERPNext API Credentials | Vorhanden | `erpNextApi` (trA9dhTurcxOP38C) |
| n8n OpenRouter Credentials | Vorhanden | `openRouterApi` (6bryUCpl9r04EdLI) |
| GenerateJobOpening Workflow | Implementiert | `n8n/generate_job_opening/GenerateJobOpening.json` |

---

## Out of Scope

- Automatische Veröffentlichung auf externen Jobbörsen
- Mehrsprachige Varianten jenseits der im Workflow vorgesehenen Sprache
- Personalisierte Kandidatenansprache pro Zielgruppe
- Automatische Vorauswahl oder Scoring von Bewerbungen
- E-Mail-Benachrichtigungen an Hiring Manager oder Bewerbende

---

## Anmerkungen

- Die Stellenanzeige wird in drei Stilrichtungen erzeugt, damit die Fachabteilung die passendste Tonalität auswählen kann.
- Das Requirements-Profil darf nur aus explizit im Stellengesuch genannten Anforderungen bestehen.
- Die Gehaltsrange wird technisch aus `expected_compensation` abgeleitet und in den Varianten transparent dargestellt.
- Nach erfolgreicher Auswahl wird die gewählte Variante in ERPNext gespeichert und als Grundlage für das Job Opening genutzt.