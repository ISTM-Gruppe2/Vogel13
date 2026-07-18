# Generierung von Stellenausschreibungen

- KurzbeschreibungAls Recruiter möchte ich, dass das System auf Basis eines manuell erstellten Stellengesuchs automatisch mehrere professionelle Varianten von Stellenausschreibungen generiert und ein strukturiertes Anforderungsprofil erstellt, damit passende Ausschreibungen effizient erstellt, bewertet und anschliessend als Job Opening veröffentlicht werden können.
  
  ### Zugehöriger Prozessschritt
  
  - Recruitment Need Identified
  - Create Job Requisition (HRMS Recruitment Module)
  - Create Job Description Variants
  - Choose Description Variant
  - Create Job Opening (HRMS Recruitment Module)
- Publish Job via Website or Recruitment Channels

### Input

- Stellengesuch (Job Requisition) aus ERPNext / HRMS
- Tätigkeitsbeschreibung
- Positionsbezeichnung (Designation)
- Erwartete Vergütung (Expected Compensation)
- Anzahl der Stellen
- Unternehmen & Abteilung
- Standort (Branch)
- Beschäftigungsart (Employment Type)
- Enddatum (Expected By)
- Anfordernde Person (Requested By)

### Verarbeitung durch AI

Die AI analysiert die Informationen aus dem Stellengesuch und führt zwei parallele Aufgaben durch:

**1\. Generierung von Stellenausschreibungen**

Es werden automatisch drei Varianten professioneller Stellenausschreibungen in unterschiedlichen Schreibstilen generiert:

- Enterprise – professionell, seriös, motivierend, ausführlich
- Modern – dynamisch, innovativ, technologieorientiert
- Compact – direkt, auf den Punkt, kompakt

**2\. Extraktion eines strukturierten Anforderungsprofils**

Aus der Tätigkeitsbeschreibung werden automatisch Anforderungen extrahiert und als validiertes Requirements-JSON bereitgestellt. Dabei werden:

- Nur explizit genannte Anforderungen übernommen (keine Halluzination)
- Anforderungen in 11 Kategorien klassifiziert (technical_skill, frameworks, methodology, experience, education, language, soft_skill, domain_knowledge, leadership, cultural_fit, logistics)
- Gewichtungen vergeben (must-have: 10, should-have: 7, nice-to-have: 3)
- Soft Skills nie als must-have klassifiziert
- Validierung und Normalisierung durch einen nachgelagerten Code-Node

### Drei automatisch generierte Varianten der Stellenausschreibung (Enterprise, Modern, Compact)

- Strukturiertes und validiertes Requirements-JSON (Anforderungsprofil) für den separaten Scoring-Prozess
- Automatische Erstellung eines Job Opening in ERPNext / HRMS mit:
  - Gewählter Beschreibungsvariante
  - Requirements-Profil
  - Berechneter Gehaltsrange (±20% der Expected Compensation, auf Tausender gerundet)
  - Standort, Beschäftigungsart, Enddatum
  - Referenz zum Stellengesuch und zur anfordernden Person
- Statusänderung der Job Description Variant auf “Published”
- Grundlage für Veröffentlichung über Website oder Recruitment Channels

### Technische Umsetzung

- **Workflow 1:** Stellengesuch → LLM-Generierung (Requirements + 3 Varianten) → Speicherung als “Job Description Variant” in ERPNext
- **Workflow 2:** Auswahl einer Variante → Automatische Erstellung des Job Opening mit allen Metadaten
- **Kommunikation:** Webhook-basiert (ERPNext → n8n), DocType Events (on_update)
- **Custom DocType:** “Job Description Variant” als Zwischenschritt zwischen Stellengesuch und Job Opening

### Systemintegration

n8n, ERPNext + HRMS, OpenRouter (LLM: Nvidia Nemotron), Webhook-basierte Kommunikation

### Risiken/Grenzen

- LLM-Qualität abhängig vom gewählten Modell (aktuell kostenloses Modell – bei Produktivbetrieb ggf. Upgrade nötig)
- Englische Begriffe in der Tätigkeitsbeschreibung können zu gemischtsprachigen Outputs führen
- Synonyme bei Sprachniveaus (z.B. “Muttersprache” statt C2, “verhandlungssicher” statt C1) werden nicht automatisch normalisiert
- Keine Halluzination garantiert, aber durch strikte Prompt-Regeln minimiert
- Gehaltsrange-Berechnung ist eine fixe Formel (±20%) – keine marktbasierte Anpassung
- Free-Tier LLM-Modelle haben Rate Limits und können bei hoher Last Timeouts verursachen