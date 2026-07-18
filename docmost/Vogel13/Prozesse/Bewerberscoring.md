# Bewerberscoring

# Zielsetzung und Umfang

Konzeption und Implementierung eines Vollautomatisierten Matching-& Scoring Prozesses innerhalb von n8n. Das System vergleicht strukturierte Stellenanforderungen mit extrahierten Bewerberdaten und ermittelt einen Applicant Score (0-100)

# Datenstrukturen (JSON-Spezifikationen)

Um eine saubere, fehlerfreie Verarbeitung in n8n zu gewährleisten, wird der Datenaustausch über strikt typisierte JSON-Objekte abgewickelt.

### Eingangs-JSON 1: Bewerberdaten (Applicant Input)

Dieses Objekt enthält die vom PDF-Parser extrahierten und vorstrukturierten Daten des eingehenden Lebenslaufs.

```json
{
  "applicant_id": "APP-9876",
  "job_id": "Dev_1031",
  "first_name": "Max",
  "last_name": "Mustermann",
  "extracted_profile": {
    "total_years_experience": 6,
    "skills_and_technologies": ["Python", "Flask", "Docker", "AWS"],
    "languages": ["Englisch (C1)", "Deutsch (B2)"],
    "education": "B.Sc. Informatik",
    "relevant_experience_summary": "6 Jahre als Backend Developer bei TechCorp. Fokus auf REST-APIs mit Flask und Python."
  }
}
```

### Eingangs-JSON 2: Stellenanforderungsprofil (Job Requirements)

Das Stellenanforderungsprofil wird durch einen HTTP Request durch die gegebene job_id aus der Bewerberdaten geladen.

Dieses Objekt definiert die Anforderungen der Vakanz. Jedes Kriterium erhält eine definierte Gewichtungsklasse.

- MUST_HAVE: K.O.-Kriterium. Bei Nichterfüllung wird der Maximalscore stark limitiert.
- SHOULD_HAVE: Kernkompetenz. Maßgeblich für die Punktesammlung.
- NICE_TO_HAVE: Bonus-Kriterium. Dient der Differenzierung im oberen Punktebereich.

```json
 {
  "job_id": "DEV-2026-05",
  "job_title": "Senior Python Developer",
  "total_max_score": 100,
  "requirements": [
    {
      "req_id": "R001",
      "category": "technical_skill",
      "description": "Mindestens 5 Jahre Berufserfahrung in Python.",
      "importance": "must-have",
      "weight": 10
    },
    {
      "req_id": "R002",
      "category": "frameworks",
      "description": "Praktische Erfahrung mit FastAPI oder Django.",
      "importance": "should-have",
      "weight": 7
    },
    {
      "req_id": "R003",
      "category": "language",
      "description": "Fließende Deutschkenntnisse in Wort und Schrift (C1).",
      "importance": "nice-to-have",
      "weight": 3
    }
  ]
}
```

### Liste gültiger Kategorien

- **technical_skill**: Allgemeine Fachkenntnisse (z.B. Programmiersprachen, Software, Maschinenbedienung).
- **frameworks**: Spezifische Technologien, Frameworks oder Bibliotheken (z.B. Django, React, Kubernetes).
- **methodology**: Arbeitsmethoden und standardisierte Prozesse (z.B. Scrum, Kanban, ITIL).
- **experience**: Art und Dauer der Berufserfahrung (z.B. Branchenerfahrung, Projektleitung, Gesamtjahre).
- **education**: Formale Abschlüsse, Studiengänge und Zertifizierungen.
- **language**: Gesprochene und geschriebene Sprachen inklusive Niveau (z.B. Deutsch C1).
- **soft_skill**: Soziale und methodische Kompetenzen (z.B. Kommunikationsstärke, Konfliktlösung).
- **domain_knowledge**: Spezifisches Branchenwissen (z.B. FinTech-Regulatorik, E-Commerce).
- **leadership**: Führungskompetenzen (z.B. Teamgröße, Budgetverantwortung).
- **cultural_fit**: Werte und Arbeitsweise (z.B. Hands-on-Mentalität, Start-up-Erfahrung).
- **logistics**: Rahmenbedingungen zur Anstellung (z.B. Reisebereitschaft, Arbeitserlaubnis).

### Ausgangs-JSON: KI-Bewertungsergebnis (Output)

Die KI führt das Matching auf Basis von Eingangs-JSON 1 und 2 durch. Der Output ist auf dieses strukturierte Format (JSON Schema) limitiert.

```json
 {
  "applicant_score": 75,
  "evaluation_summary": "Der Kandidat bringt die geforderte Kernkompetenz in Python mit (6 Jahre Erfahrung). Es fehlt jedoch Erfahrung mit den spezifisch geforderten Frameworks FastAPI/Django, und das Deutschniveau liegt unter der Anforderung.",
  "criteria_evaluation": [
    {
      "req_id": "R001",
      "status": "fulfilled",
      "evidence_from_cv": "6 Jahre als Backend Developer mit Python bei TechCorp.",
      "score_impact": "positive"
    },
    {
      "req_id": "R002",
      "status": "unfulfilled",
      "evidence_from_cv": "Erfahrung mit Flask vorhanden, aber FastAPI oder Django werden im Profil nicht erwähnt.",
      "score_impact": "negative"
    },
    {
      "req_id": "R003",
      "status": "partially_fulfilled",
      "evidence_from_cv": "Deutschkenntnisse auf B2-Niveau vorhanden, C1 war gewünscht.",
      "score_impact": "neutral"
    }
  ]
}
```

## Bewertungslogik & Prozessanforderungen

- Transparenz: Für jedes bewertete Kriterium muss die KI im Output eine kurze Begründung (Evidence) anhand des CV-Textes liefern.
- Halluzinationsprävention: Die System-Prompt-Direktive muss der KI verbieten, Kompetenzen anzunehmen, die nicht explizit im parsed_cv_text genannt werden