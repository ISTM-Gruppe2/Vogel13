# AI im Recruiting-Prozess

### Stellenausschreibung & Anforderungsanalyse @Arion

![diagram.drawio.svg](files/019e56c8-2339-7238-bf1d-b24b8710e26b/diagram.drawio.svg?t=1782058449580)

**AI-Aufgabe:**

Stellenausschreibung, Generierung von Beschreibungsvarianten, Extraktion strukturierter Anforderungsprofile (Requirements-JSON)

---

**Input:**

Stellengesuch (Job Requisition), Tätigkeitsbeschreibung, Designation, Unternehmen, Abteilung, Vergütung, Standort, Beschäftigungsart

---

**Output:**

3 Stellenausschreibungsvarianten (Enterprise, Modern, Compact), strukturiertes Requirements-Profil (JSON) mit kategorisierten und gewichteten Anforderungen, automatisierte Erstellung von Job Opening inkl. Gehaltsrange, Standort, Enddatum

---

**Systemintegration:**

n8n, ERPNext + HRMS, OpenRouter (LLM), Webhook-basierte Kommunikation

### CV-Parsing & Applicant Scoring @Luis Bleckmann

![diagram.drawio.svg](files/019e56c8-7ca6-759a-8f11-b877f542324d/diagram.drawio.svg?t=1779882749336)

**AI-Aufgabe:**

Mapping des Anforderungsprofil auf die Fähigkeiten des Kandidaten

---

**Input:**

Extrahierte Daten aus dem Lebenslauf als JSON

---

**Output:**

JSON mit einem Zugewiesenen Bewerberscore (0-100) mit einer erklärung welche Kriterien erfüllt sind und warum

---

**Systemintegration:**

n8n, ERPNext

### Bewerberstatusänderungen @Basti

![diagram.drawio.svg](files/019e694a-9cc9-7714-913b-e2a8308764df/diagram.drawio.svg?t=1779882958028)

**AI-Aufgabe:**

Terminabstimmung, Verfassen von E-Mails, Auswertung von Daten, Überprüfung von Fristen

---

**Input:**

Kandidaten, Bewerbungsgespräch

---

**Output:**

Einladung, Terminvorschlag, bestätigter Termin/ Absage, Benachrichtigungen, Erinnerungen fehlender Dokumente / Zusage, Erstellung Bewerbungsgespräch

---

**Systemintegration:**

n8n, ERPNext + HRMS, AI-Service

### [Analyse von Interview-Feedback zur Vertragsvorbereitung](AI%20im%20Recruiting-Prozess/Analyse%20von%20Interview-Feedback%20zur%20Vertragsvorbereitung.md) @Florim

![diagram.drawio.svg](files/019e56c9-6604-7451-ac30-b0c4faa9381b/diagram.drawio.svg?t=1779812848984)

**AI-Aufgabe:**

Interviewdokumentation, Interviewzusammenfassung (als gesamtes Dokument), Extraktion relevanter Entscheidungs- und Vertragsinformationen

---

**Input:**

Interviewnotizen, Bewertungen, Freitext-Kommentare, Ratings

---

**Output:**

strukturierte Zusammenfassung, erkannte Stärken/ Schwächen, offene Punkte, Eintrittstermin, Gehaltsrahmen, Arbeitsmodell, Risiken, Klärungsbedarf

---

**Systemintegration:**

n8n, ERPNext + HRMS, AI-Service

### HEADLINE 5

![diagram.drawio.svg](files/019e56cb-3f9d-74db-904c-8796c4354efa/diagram.drawio.svg?t=1779812928503)

**AI-Aufgabe:**

---

**Input:**

---

**Output:**

---

**Systemintegration:**

### HEADLINE 6 @Florim

![diagram.drawio.svg](files/019e56ce-b205-71e1-ac1a-d49e7d29f313/diagram.drawio.svg?t=1779813758676)

**AI-Aufgabe:**

---

**Input:**

---

**Output:**

---

**Systemintegration:**

---

### Schema

2 col - rechte Seitenleiste

**linke col:**

[draw.io](http://draw.io) Diagramm

Recruitment-Prozess

**rechte col:**

Beschreibung AI Integration

**AI-Aufgabe:**

Vorauswahl/ Matching Bewerber

---

**Input:**

CV

---

**Output:**

Ranking, Shortlist, Begründung

---

**Systemintegration:**

n8n + AI-Service + ERPNext x HRMS