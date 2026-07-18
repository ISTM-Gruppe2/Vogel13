---
name: generate-screening-feedback
description: Use when the user asks to generate screening feedback (Runde 1 – "Screening und Kennenlernen") for an applicant in the bachelorproject recruitment system. Creates realistic German freetext HR interview notes for the first interview round covering 8 fixed soft-skill criteria.
---

# Generate Screening Feedback

## Kontext

This skill generates realistic interview feedback for the first round — **Screening und Kennenlernen** — as freetext HR notes (no ERPNext import). The feedback evaluates 8 fixed soft-skill criteria in a structured, concise format. All feedback is written in German, stored in `dummy_data/interview_feedback/screening/`. All paths in this skill are relative to the workspace root.

## Pre-Generation Checks

Before generating feedback, always:
1. Read `dummy_data/interview_feedback/InterviewFeedback.csv` to find the **next available feedback ID** (`FB-XXXX`) and avoid duplicates.
2. Check whether screening feedback already exists for this applicant (search `screening/APP-XXXX_*` directories).
3. Determine the next ID: highest existing `FB-XXXX` + 1.

## Identify Parameters

Ask or determine:
- **Applicant ID** (e.g., `APP-0009`) — which applicant to generate feedback for.
- **Job opening match** (optional): if the applicant is matched to a specific `HR-HIREQ-XXXX`, use that for context.
- **Career changer** (check CV): if the applicant's background differs from the target role, treat them as a career changer (see Career Changer Rules).

## Input Sources

Read these before generating, **in this order**:

| # | Source | Path | Provides |
|---|--------|------|----------|
| 1 | Feedback CSV | `dummy_data/interview_feedback/InterviewFeedback.csv` | Next ID, existing decisions for this applicant, Role/Department |
| 2 | Applicant CSV | `dummy_data/applicants/Bewerber.csv` | Name, Email, City — used in Logistik section |
| 3 | Applicant CV | `dummy_data/applicants/{role}/APP-XXXX_FirstName_LastName/APP-XXXX_FirstName_LastName_CV.yaml` | Companies, dates, skills, career stations — concrete facts for strengths/weaknesses. Also extract **role** and **seniority** for decision calibration. |
| 4 | Job opening | `dummy_data/job_openings/{department}/HR-HIREQ-XXXX_Position/` (if matched) | Target role, department name — role fit context. `department` goes into InterviewFeedback.csv. |
| 5 | Interview Round JSON | Provided by user in the prompt (optional) | **Definitive list of `expected_skill_set` entries** — exact skill names for the Skill Assessment block. If provided, these names OVERRIDE the defaults. |
| 6 | Feedback template | `dummy_data/interview_feedback/INTERVIEW_FEEDBACK_TEMPLATE.md` | Format reference, decision logic summary |
| 7 | Reference example | Any file in `dummy_data/interview_feedback/screening/` | Structure and tone calibration |

## Generation Process

### Output

**Output filename**: `APP-XXXX_FirstName_LastName_Feedback.txt`
**Directory**: `dummy_data/interview_feedback/screening/APP-XXXX_FirstName_LastName/`

### Format

```
Gesamteindruck: [1-2 Sätze, Tonfall, ein konkretes prägnantes Detail]

Stärken:
- [Konkretes Positiv mit Zahl, Fakt oder Zitat]
- [... 3-6 Punkte]

Schwächen:
- [Konkretes Negativ mit Beleg oder Aussage aus dem Gespräch]
- [... 2-5 Punkte]

Kultur: [MAX 2 kurze Sätze zu Werten, Team-Fit, Arbeitsstil, Persönlichkeit]

Logistik:
- Remote: [X Tage / Modell]
- Start: [Datum]
- Gehalt: [Betrag] ([Budget/Kommentar])
- Urlaub: [X Tage]

→ [Entscheidung] [optional: Notiz für Runde 2]

Skill Assessment:
- Motivation: ★★★★☆
- Kommunikationsfähigkeit: ★★★☆☆
- Kulturelle Passung: ★★★★☆
- Verfügbarkeit: ★★★★☆
- Beruflicher Werdegang: ★★★★☆
- Sprachkenntnisse: ★★★★☆
- Selbstreflexion: ★★★☆☆
- Fragen des Kandidaten: ★★★★☆
```

### The 8 Screening Criteria

Must be implicitly covered in the text:
1. **Motivation** — Interest in role, domain, and company
2. **Kommunikationsfähigkeit** — Clarity, structure, audience-appropriate expression
3. **Kulturelle Passung** — Value alignment, team fit, working style
4. **Verfügbarkeit** — Start date, work model, salary expectation within budget
5. **Beruflicher Werdegang** — Plausible career progression, explainable job changes, no critical gaps
6. **Sprachkenntnisse** — German and English, business fluent
7. **Selbstreflexion** — Realistic self-assessment of strengths and development areas
8. **Fragen des Kandidaten** — Preparation and genuine interest through targeted questions

### Skill Assessment Names (MANDATORY)

The `Skill Assessment` block MUST use the EXACT skill names from the Interview Round JSON's `expected_skill_set` entries. The default standard screening round uses these exact 8 names:

- Motivation
- Kommunikationsfähigkeit
- Kulturelle Passung
- Verfügbarkeit
- Beruflicher Werdegang
- Sprachkenntnisse
- Selbstreflexion
- Fragen des Kandidaten

Do NOT rephrase, translate, abbreviate, or rename these skills. Names must match character-for-character.

### Separation of Concerns — SOFT SKILLS ONLY (CRITICAL)

Screening evaluates **exclusively soft skills**. Technical evaluation belongs to Runde 2 (Fachgespräch).

- **Allowed (superficial only)**: Mention that the CV shows relevant tech keywords (".NET-Stack passt zur Stelle", "CV listet Azure DevOps"). Note career stations and companies. Say whether the profile generally fits the opening.
- **FORBIDDEN**: Deep-diving into architecture decisions, discussing tool-specific workflows, quoting technical metrics (30% API reduction, 500K rows migrated), evaluating technical depth of specific frameworks, or describing technical achievements in detail.
- **Self-check**: If any bullet point contains a technology name followed by a quantified achievement, it's too technical. Rewrite from a soft-skill angle (motivation, learning speed, career progression).
- **Example violation**: "Migration .NET Framework → .NET 8 mit Microservice-Architektur, Deployment von 2h auf 15min reduziert" → belongs in Fachgespräch. Correct screening version: "Hat bei HanseSoft ein grösseres Migrationsprojekt eigenständig durchgezogen, zeigt Eigeninitiative und Lernfähigkeit."

### Decision Logic

- `Weiter zu Runde 2` — Candidate fits, minor concerns acceptable
- `Tendenz eher Nein` — Mixed impression, skepticism remains
- `Absage` — KO criterion violated (wrong profile, too little experience, culture mismatch, salary too high)
- `Vormerken für andere Rolle` — Doesn't fit this position, but interesting for other roles

### Skill Assessment

After the decision arrow, append star ratings (★☆) for all 8 criteria. Ratings must align with described strengths/weaknesses. No numeric scores.

## Career Changer Rules

If the applicant's CV shows a background that differs from the target role:
- Name the gap explicitly under Schwächen — what they have vs. what the role needs.
- Be specific about missing technologies or domain knowledge, not abstract ("fehlende Erfahrung").
- The decision should reflect whether the gap is bridgeable or fundamental.

## Writing Style Rules

### Tone (PROFESSIONAL, CONCISE, REALISTIC)

- Write like a professional HR interviewer documenting the conversation immediately afterwards — factual, direct, no fluff.
- Short, clear sentences. No filler words.
- Evaluative but fair. State observations, not opinions.
- No colloquial language, no Umgangssprache, no slang.
- Use "der Kandidat" or the applicant's first name — be consistent.

### Abbreviations

Use only standard business German abbreviations where appropriate:
- bzgl. (bezüglich)
- evtl. / ggf. (eventuell / gegebenenfalls)
- ca. (circa)
- z.B. (zum Beispiel)
- u.a. (unter anderem)
- d.h. (das heißt)
- etc.

Do NOT use informal abbreviations like "bissl", "m.M.n.", "eig.", "hamma", "ner".

### Concreteness Rules

- ALWAYS reference concrete numbers, dates, and facts from the CV.
- State salary expectation, start date, remote preference, vacation days.
- Mention company names and career stations from the CV.
- For career changers: explicitly name the gap (e.g., "Als IT-Systemadministrator keine Cloud-native Erfahrung — für Platform Engineering fehlen K8s, IaC, CI/CD").
- Never write abstract ("gute Erfahrung") — write specific ("5 Jahre Java/Spring Boot bei zwei Arbeitgebern").

### Structure

- Each bullet point MAX 2 lines — if longer, split it.
- No explanatory preamble or conclusion within bullet points — just the observation.
- Empty line between major sections.
- Gesamteindruck: 1-2 Sätze only.
- Kultur: MAX 2 short sentences.

### Candidate Quotes

- At least 1-2 direct quotes with quotation marks per feedback.
- Quotes must sound like real spoken German, capturing the candidate's own words.

### Self-Check (Before Writing Output)

- Does this read like a professional HR interviewer's factual notes?
- Is every strength/weakness backed by a concrete number, date, or fact from the CV?
- Is Kultur MAX 2 short sentences?
- Is the decision arrow unambiguous?
- Are the Skill Assessment names EXACTLY the 8 standard names?
- Is the feedback free of technical deep-dives? If a bullet contains technology + quantified achievement, rewrite from soft-skill angle.
- Is the text free of Umgangssprache and informal expressions?

### Anti-Patterns (AVOID)

- ❌ "Der Kandidat verfügt über umfassende Erfahrung in..." → "5 Jahre Java/Spring Boot bei mediaworx und LogiCore"
- ❌ "Die Kommunikationsfähigkeiten sind als entwicklungsfähig einzustufen" → "Spricht leise, antwortet zögerlich"
- ❌ Multi-clause sentences with commas and subclauses in bullet points
- ❌ HR jargon: "Skill-Gap", "Onboarding-Prozess", "Entwicklungspotenzial"
- ❌ Describing the process instead of the observation: "Auf Nachfrage gab er an..." → state what was said
- ❌ Colloquial filler words and informal judgment ("naja", "ehrlich gesagt", "weiß nicht recht")
- ❌ Technical deep-dives in screening. If a Stärken bullet reads like a CV highlight with technology + number, it belongs in Fachgespräch.

## Variation Rules

- EVERY feedback must read differently — vary phrasing, focus areas, personality descriptions.
- Vary which criteria get emphasis (some more culture, others more availability, others personality).
- Describe different personality types (reserved vs. dominant vs. enthusiastic).

## Save & Track

1. Create the output directory if it doesn't exist:
   - `dummy_data/interview_feedback/screening/APP-XXXX_FirstName_LastName/`
2. Write the feedback text file.
3. Append a new row to `dummy_data/interview_feedback/InterviewFeedback.csv`:
   - Format: `FB-XXXX,APP-XXXX,FirstName LastName,Role,Department,Screening,Decision,YYYY-MM-DD`
   - **Round**: Always `Screening`.
   - **Role**: From the applicant's CV. Same value as existing rows for this applicant.
   - **Department**: From the job opening's department field (if matched). Otherwise, from existing rows for this applicant. If first feedback, derive from role (e.g., Platform Engineer → "Operations & Delivery - UDEC").
   - Use today's date.

## Response

Reply concisely with:
- Applicant name and ID
- Round (Screening)
- Decision
- File path

## Boundaries

- Do NOT generate ERPNext Interview records or Interview Feedback records — freetext only.
- Do NOT use real personal data.
- Do NOT write generic, vague feedback.
- Do NOT create duplicate or near-identical feedback texts.
- Feedback must be in German.
- Do NOT include skill assessment tables or numeric ratings inside the feedback body — only star ratings in the Skill Assessment block.
- Do NOT deep-dive into technical topics — that belongs to the Fachgespräch (generate-fachgespraech-feedback skill).
- Do NOT use Umgangssprache, slang, or informal judgmental phrases.

## Priority

1. Realism (reads like actual professional HR notes)
2. Concreteness (specific CV details, numbers, quotes)
3. Brevity (concise, no filler)
4. Variation (each feedback unique)
5. Decision clarity (outcome is unambiguous)
6. Consistency with the applicant's CV profile