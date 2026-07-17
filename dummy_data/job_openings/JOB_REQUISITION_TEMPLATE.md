# Job Requisition Template (Stellengesuch)

## Zweck
Dieses Template definiert das Standardformat für interne Stellengesuche (Job Requisitions) in ERPNext HRMS. Es dient als Vorlage für die Generierung von Dummy-Daten und stellt Konsistenz über alle Stellengesuche sicher.

---

## Format-Spezifikation

### 1. YAML-Datei (ERPNext Import)

**Dateiname:** `HR-HIREQ-XXXX_Position_Title.yaml`

**Speicherort:** `job_openings/{department}/HR-HIREQ-XXXX_Position_Title/`

**Struktur:**

```yaml
naming_series: HR-HIREQ-XXXX
designation: <Positionstitel>
department: <Abteilung>
no_of_positions: <Anzahl>
expected_compensation: <Gehalt in EUR>
custom_location: <Standort>
company: <Fiktiver Firmenname>
status: <Status>
custom_employment_type: <Anstellungsart>
posting_date: YYYY-MM-DD
expected_by: YYYY-MM-DD
description: |
  <h2>Aufgaben</h2>
  <ul>
    <li><Aufgabe 1></li>
    <li><Aufgabe 2></li>
    ...
  </ul>

  <h2>Anforderungen</h2>
  <ul>
    <li><Anforderung 1></li>
    <li><Anforderung 2></li>
    ...
  </ul>
```

---

### 2. Description-Markdown (Interne Vorlage)

**Dateiname:** `Position_Title_Description.md`

**Speicherort:** Gleicher Ordner wie YAML-Datei

**Struktur:**

```markdown
# <Positionstitel> (w/m/d)

**Designation:** <Positionstitel>  
**Department:** <Abteilung>  
**Location:** <Standort> (<Arbeitsmodell>)  
**Employment Type:** <Anstellungsart>  
**No. of Positions:** <Anzahl>  
**Expected Compensation:** <Gehalt in EUR>  
**Status:** <Status>  
**Posting Date:** <Datum>  
**Expected By:** <Datum>

---

## Aufgaben

- <Aufgabe 1>
- <Aufgabe 2>
- <Aufgabe 3>
- ...

## Anforderungen

- <Anforderung 1>
- <Anforderung 2>
- <Anforderung 3>
- ...
```

---

## Pflichtfelder

| Feld | ERPNext Fieldname | Typ | Format/Beispiel |
|------|-------------------|-----|-----------------|
| **Naming Series** | `naming_series` | String | `HR-HIREQ-0001`, `HR-HIREQ-0002`, ... |
| **Positionstitel** | `designation` | String | `Cyber Security Consultant OT` |
| **Abteilung** | `department` | String | `IT`, `Engineering`, `HR`, `Finance`, ... |
| **Anzahl Stellen** | `no_of_positions` | Integer | `1` (Default), max. 10 |
| **Gehalt** | `expected_compensation` | Currency | `75000` (Jahresbrutto in EUR) |
| **Standort** | `custom_location` | String | `Essen`, `München`, `Berlin`, ... |
| **Firma** | `company` | String | Fiktiver deutscher Firmenname |
| **Status** | `status` | Select | `Pending`, `Open & Approved`, `Rejected`, `Filled`, `On Hold`, `Cancelled` |
| **Anstellungsart** | `custom_employment_type` | String | `Full-time`, `Part-time`, `Contract`, `Working Student` |
| **Posting Date** | `posting_date` | Date | `YYYY-MM-DD` |
| **Expected By** | `expected_by` | Date | `YYYY-MM-DD` (ca. 30-60 Tage nach Posting) |
| **Description** | `description` | Text Editor | HTML-formatiert (siehe unten) |

---

## Description-Formatregeln

### HTML-Struktur (für YAML)

```html
<h2>Aufgaben</h2>
<ul>
  <li>Aufgabe 1</li>
  <li>Aufgabe 2>
  <li>Aufgabe 3</li>
</ul>

<h2>Anforderungen</h2>
<ul>
  <li>Anforderung 1</li>
  <li>Anforderung 2</li>
  <li>Anforderung 3</li>
</ul>
```

### Markdown-Struktur (für Description-Datei)

```markdown
## Aufgaben

- Aufgabe 1
- Aufgabe 2
- Aufgabe 3

## Anforderungen

- Anforderung 1
- Anforderung 2
- Anforderung 3
```

---

## Content-Richtlinien

### Aufgaben (5-8 Punkte)
- Beginne mit Aktionsverben (Organisation, Durchführung, Entwicklung, ...)
- Beschreibe konkrete Tätigkeiten
- Quantifiziere wo möglich (z.B. "Verwaltung von 50+ Systemen")
- Fokus auf Kernverantwortlichkeiten

### Anforderungen (5-10 Punkte)
- Unterscheide zwischen Muss- und Kann-Kriterien
- Nenne konkrete Technologien/Tools
- Spezifiziere Sprachkenntnisse
- Erwähne Reisebereitschaft falls nötig
- Zertifizierungen als "von Vorteil" kennzeichnen

### NICHT enthalten (internes Dokument!)
- ❌ Benefits/Sozialleistungen
- ❌ "Über uns"-Texte
- ❌ Marketing-Sprache
- ❌ Bewerbungsprozess-Details
- ❌ Kontaktinformationen

---

## Gehaltsrichtlinien (Deutschland, Jahresbrutto EUR)

| Seniorität | Spanne | Beispiel |
|------------|--------|----------|
| Junior | 45.000 - 60.000 | 50.000 |
| Mid-Level | 55.000 - 75.000 | 65.000 |
| Senior | 70.000 - 95.000 | 80.000 |
| Lead/Manager | 85.000 - 120.000+ | 95.000 |

---

## Status-Werte

| Status | Bedeutung |
|--------|-----------|
| `Pending` | Genehmigung ausstehend |
| `Open & Approved` | Genehmigt und offen |
| `Rejected` | Abgelehnt |
| `Filled` | Besetzt |
| `On Hold` | Pausiert |
| `Cancelled` | Storniert |

---

## Anstellungsarten

| Type | Beschreibung |
|------|--------------|
| `Full-time` | Vollzeit (35-40h/Woche) |
| `Part-time` | Teilzeit (20-30h/Woche) |
| `Contract` | Befristet/Werkvertrag |
| `Working Student` | Werkstudent |

---

## Ordnerstruktur

```
job_openings/
├── JobOpenings.csv              (Zentrale Übersicht)
├── JOB_REQUISITION_TEMPLATE.md  (Dieses Template)
└── {department}/                (Abteilungsordner)
    └── HR-HIREQ-XXXX_Position/
        ├── HR-HIREQ-XXXX_Position.yaml    (ERPNext Import)
        └── Position_Description.md        (Interne Vorlage)
```

**Beispiel:**
```
job_openings/
├── JobOpenings.csv
├── JOB_REQUISITION_TEMPLATE.md
└── it/
    └── HR-HIREQ-0001_Cyber_Security_Consultant_OT/
        ├── HR-HIREQ-0001_Cyber_Security_Consultant_OT.yaml
        └── Cyber_Security_Consultant_OT_Description.md
```

---

## JobOpenings.csv Format

```csv
ID,Designation,Department,Location,Employment Type,Status,Company,Posting Date,Expected Compensation
HR-HIREQ-0001,Cyber Security Consultant OT,IT,Essen,Full-time,Open & Approved,E.ON Digital Technology GmbH,2026-07-08,75000
HR-HIREQ-0002,Software Engineer,Engineering,München,Full-time,Open & Approved,Tech Solutions GmbH,2026-07-10,65000
```

---

## ID-Verwaltung

- IDs werden sequentiell vergeben: `HR-HIREQ-0001`, `HR-HIREQ-0002`, ...
- IDs werden in `JobOpenings.csv` tracked
- Vor Generierung neuer ID: CSV auf höchste ID prüfen
- IDs niemals wiederverwenden

---

## Qualitätscheckliste

Vor dem Speichern prüfen:
- [ ] Alle Pflichtfelder ausgefüllt
- [ ] ID ist eindeutig (nicht in JobOpenings.csv vorhanden)
- [ ] Datum im Format YYYY-MM-DD
- [ ] Expected By liegt nach Posting Date
- [ ] Gehalt passt zur Seniorität
- [ ] Description enthält nur Aufgaben + Anforderungen
- [ ] Keine Benefits/Marketing-Texte enthalten
- [ ] HTML in YAML ist valide
- [ ] Ordnerstruktur entspricht dem Template
