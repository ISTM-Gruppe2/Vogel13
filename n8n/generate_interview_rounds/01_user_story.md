# User Story: Automatische Generierung von Interviewrunden

## Ausgangssituation
Interviewrunden im ERPNext HRMS besitzen das Feld "Erwartete Fähigkeiten", welches zur späteren Bewertung im Interviewprozess (Sternchen-Bewertung) dient.

Der bestehende Workflow generiert bereits:
- Stellenausschreibungen in 3 Varianten
- Strukturiertes Requirements-Profil mit kategorisierten Fähigkeiten

## Ziel
Die KI soll basierend auf dem extrahierten Requirements-Profil automatisch eine oder mehrere Interviewrunden vorschlagen und die relevanten Fähigkeiten zuordnen.

## Erweiterter Workflow
```
Stellengesuch erstellen 
  → Stellenausschreibung wird KI-generiert 
  → Fähigkeiten erkennen & extrahieren (✓ bereits implementiert)
  → Interviewrunden generieren & Fähigkeiten zuordnen (NEU)
  → CRUD-Operation für Interview-Runde in ERPNext
```

## Beispiel
**Input:** C#-Entwickler gesucht

**Extrahierte Requirements:**
- technical_skill: .NET, C#
- technical_skill: Versionskontrolle (Git)
- methodology: MVVM, MVC
- technical_skill: Tooling

**Generierte Interviewrunde:**
- Rundenname: "Technisches Fachgespräch"
- Offene Stelle: HR-OPN-2026-XXXX (`job_opening`)
- Erwartete Fähigkeiten: Child Table `expected_skill_set` mit Skill + Beschreibung
  - .NET, C#, Git, MVVM, MVC, Tooling
- Bewerbungsgesprächstyp: "Technical Interview" (`interview_type`)
- Interviewer: [`Ersteller des Stellengesuchs`] (`interviewers` Array)
- Position: 2 (second interview round, after the pre-defined screening round)

## Required Fields (Interview Round Doctype)
- `round_name` (Rundenname)
- `job_opening` (Offene Stelle → Link zu Job Opening)
- `expected_skill_set` (Erwartete Fähigkeiten → Child Table)
  - `skill` (Name der Fähigkeit)
  - `description` (Beschreibung der Fähigkeit)

## Optional Fields
- `interview_type` (Bewerbungsgesprächstyp)
- `interviewers` (Interviewer → Array von Links zu Employee, Default: requester)
- `position` (Position/Reihenfolge)
- `expected_average_rating` (Erwartete Durchschnittsbewertung, Default: 0.0)

## Constraints
- Interviewer MUSS gesetzt werden (für Feedback-Funktionalität erforderlich)
- Default: Interviewer = `requested_by` aus Stellengesuch → Eintrag in `interviewers` Array
- Skills werden aus dem Requirements-Profil übernommen (Kategorien: technical_skill, frameworks, methodology, domain_knowledge)
- Skills werden als Child Table Einträge in `expected_skill_set` gespeichert (mit `skill` und `description`)

## Akzeptanzkriterien
1. Für jedes Requirements-Profil wird mindestens eine Interviewrunde vorgeschlagen
2. Die Fähigkeiten der Interviewrunde entsprechen den extrahierten Requirements
3. Der Interviewer wird automatisch auf den Anforderer gesetzt
4. Die generierte Interviewrunde kann vor dem Speichern manuell angepasst werden
5. Nach Bestätigung wird die Interviewrunde als Draft in ERPNext gespeichert
