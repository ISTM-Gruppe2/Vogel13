# AGENTS.md

## Project Context
This repository is used to generate dummy applicants for a bachelor project
about automating the recruiting process.
The technical context is Frappe Framework, ERPNext, Frappe HR, and n8n.

## Main Task
Generate new fully fictional applicant profiles on request, including:
1. a structured applicant record
2. a matching resume in RenderCV YAML format

## Goal
Each generated applicant must:
- be fully fictional,
- look realistic and professionally plausible,
- fit a specific target role or job posting,
- include all required applicant fields,
- include a matching RenderCV-compatible YAML resume,
- be reusable for recruiting demos, parsing tests, web form tests, and ERPNext-related follow-up processes.

## Required Applicant Fields
For every generated applicant, always create the following required fields:

- ID
- Status
- First Name
- Street
- City
- Last Name
- Postal Code
- Country
- Nationality
- Email Address
- Phone Number

## Consistency Rules
- First Name and Last Name must exactly match the resume.
- City and Country in the applicant record must match the location in the CV.
- Email Address and Phone Number must be fictional but syntactically valid.
- Nationality must be plausible for the profile, without representing a real person.
- Street and Postal Code must look realistic, but remain safe fictional dummy data.
- Status should default to a project-friendly initial value such as `New`, unless the user specifies another status.
- ID must be unique and follow a consistent naming scheme.

## ID Rules
- Use a stable ID format such as:
  - `APP-0001`
  - `APP-0002`
  - `APP-0003`
- Never reuse an existing applicant ID.

## Main Output Format
For each generated applicant, create:
1. a structured applicant dataset row
2. a RenderCV YAML file

## Resume Output Rules
- Always generate the resume as a RenderCV YAML file.
- Use the filename format `FirstName_LastName_CV.yaml`.
- Add this schema reference line at the top of every YAML file:

# yaml-language-server: $schema=https://github.com/rendercv/rendercv/blob/main/schema.json?raw=true

- Use the RenderCV structure with:
  - `cv` as the required top-level field
  - optional `design`
  - optional `locale`
  - optional `settings`

## Minimum Resume Content
Each generated resume must contain at least:
- full fictional name
- location
- email
- phone number
- optional LinkedIn, GitHub, or website
- 2 to 4 work experience entries with detailed bullet points
- 1 to 2 education entries
- **Sprachkenntnisse** (zwingend): Deutsch und Englisch mit Niveaustufen (z. B. Muttersprache, C1, B2)
- optional: projects (can be integrated into experience)
- optional: skills and certificates (only if relevant and space permits)

## Resume Plausibility Rules
- Never use real personal data.
- Never recreate or imitate a real person's profile.
- Experience, education, skills, and projects must fit the target role.
- Timelines must be logically consistent.
- The resume must fill the page appropriately without significant empty space.
- The resume must fit on exactly one page.
- Text should be concise, professional, and ATS-friendly.

## Seniority Rules
- Junior: 0 to 2 years of experience
- Mid-level: 2 to 5 years
- Senior: 5 to 8 years
- Lead or Manager: 7+ years, optionally including leadership responsibility

## Variation Rules
To avoid repetitive dummy data:
- vary names, cities, education paths, and career steps,
- vary skill combinations according to the role,
- do not reuse identical summary texts,
- do not reuse identical experience bullet points,
- avoid duplicate last names if generated applicants already exist in the repository.

## Gender Handling
When the user specifies a gender:
- Use a first name that clearly indicates the requested gender.
- Pronouns and role titles (e.g., "Head of", "Senior Engineer") remain gender-neutral as is industry standard.
- If no gender is specified, vary between male and female profiles across generations.

## Role Alignment
If a target role is given:
- align the summary, skills, projects, and work experience to that role.

If no target role is given:
- ask for the role, language, and seniority level,
- or propose 3 suitable roles for the recruiting demonstrator.

## Career Changer Profiles
When the user requests a profile from a different background for a role:
- The applicant's existing skills and experience must come from a plausibly different field.
- The CV should not contain relevant experience for the target role — the gap should be visible.
- Education can match or differ from the target role, depending on the career change narrative.
- Skill categories should reflect the applicant's actual background, not the target role.
- This is useful for testing the recruiting system's ability to identify mismatches.
- Examples: IT-Systemadministrator applying for Platform Engineering (no cloud-native experience), or a
  Mechanical Engineer applying for Data Science.

## Required Resume Sections and Structure
Each generated resume must follow this exact structure and order:

1. **Experience / Projects** (main section, most detailed)
   - This section should be the largest and most detailed part of the resume
   - Include 2-4 work experience entries with detailed bullet points (3-5 bullets per role)
   - Projects must be listed as a separate section with summary and highlights
   - Each bullet point should quantify achievements where possible (percentages, numbers, time savings)
   - Use action verbs and describe specific technologies and methodologies used
   - This section must be detailed for all seniority levels, including mid-level applicants
   - Projects should demonstrate practical application of skills relevant to the target role

2. **Education** (secondary section)
   - List university/school with degree and dates
   - Use abbreviated degree names (e.g., "B.Sc.", "M.Sc.", "PhD") to avoid wrapping issues
   - The field of study goes in the "area" field, not in the degree field
   - Include GPA only if good to excellent (e.g., German GPA 1.0-2.5, or equivalent honors)
   - Keep descriptions minimal unless notable achievements exist

3. **Skills / Certificates** (optional, compact)
   - Only include skills and certificates relevant to the target role
   - This section is optional and may be omitted if the Experience section is sufficiently detailed
   - If included, keep it compact (approximately 25-30% of a standard section)
   - List only key technologies and certifications that add value

## Address and Contact Rules
- All addresses and phone numbers must be limited to Germany
- Use realistic German street names and postal codes
- Phone numbers must follow German format (+49 ...)
- Email addresses should use German domains (.de) when possible

## Language Rules
- Default language: German.
- Use English if the role, job title, or user request clearly calls for English.
- Technical terms may remain in English when this is more realistic.

## Multi-Language Version Rules
When the user requests multiple language versions (e.g., German + English):
- Create separate YAML files for each language version.
- Use naming convention: `FirstName_LastName_CV.yaml` (primary) and `FirstName_LastName_CV_EN.yaml` (English).
- Translate all content fields (highlights, summaries, section labels) — not just the locale setting.
- Skill and technology names remain in English (this is industry standard).
- Render both versions following the RenderCV Execution Rules for multi-version output.
- If the user only says "add an English version", keep the existing German version intact.

## Working Style
- Check whether similar applicants already exist before generating a new one.
- Avoid duplicates in names, last names, skill patterns, and career paths.
- Build the YAML structure carefully before writing content.
- Prefer compact, structured output over decorative writing.
- Use Markdown inside RenderCV fields only where it is appropriate and safe.

## Storage Rules
Store generated files in a structured folder layout, for example:
- `applicants/cloud-platform-engineer/`
- `applicants/data-analyst/`
- `applicants/software-engineer/`

Each applicant must have their own directory containing:
- The RenderCV YAML source file (e.g., `APP-0001_Lea_Mueller_CV.yaml`)
- The rendered CV output files (e.g., `Lea_Mueller_CV.pdf`)

Example structure:
```
applicants/cloud-platform-engineer/
  APP-0001_Lea_Mueller/
    APP-0001_Lea_Mueller_CV.yaml
    Lea_Mueller_CV.pdf
  APP-0002_Thomas_Weber/
    APP-0002_Thomas_Weber_CV.yaml
    Thomas_Weber_CV.pdf
```

Store applicant table outputs in a consistent file such as:
- `applicants/Bewerber.csv`
or in batch files such as:
- `applicants/batches/bewerber_batch_001.csv`

## Standard Behavior for Generation Requests
When the user asks to generate a new applicant:
1. Identify the target role, language, and seniority.
2. Generate one new fictional applicant profile.
3. Create the structured applicant data with all required fields.
4. Create the matching RenderCV YAML resume file.
5. Save both outputs in the correct folder.
6. Execute RenderCV to produce rendered outputs (PDF, PNG, HTML, MD, Typst).
7. Respond briefly with the generated applicant name, role, and file path.

## Boundaries
- Do not use real personal data.
- Do not generate unnecessary long resumes unless explicitly requested.
- Do not output free-text resumes instead of YAML unless the user explicitly asks for that.
- Do not leave required applicant fields empty.
- Do not create inconsistent data between applicant record and resume.

## RenderCV Execution Rules
- Always execute RenderCV after creating a YAML file to produce rendered outputs.
- On Windows, the `rendercv` CLI may not be in PATH. Use `python -m rendercv render` instead.
- On Windows, always set `PYTHONIOENCODING=utf-8` to avoid `UnicodeEncodeError` with special characters.
- RenderCV derives output filenames from the `name` field in the YAML, not from the YAML filename.
- When rendering multiple versions (e.g., German + English) for the same applicant:
  - Render them sequentially (RenderCV overwrites the output directory on each run).
  - After each render, rename output files with a language suffix (e.g., `_DE`, `_EN`) before the next render.
  - Alternatively, render to a temporary directory, move files, then render the next version.
- Rendered outputs go into a `rendercv_output/` subdirectory relative to the YAML input file.
- Verify the render produced exactly ONE PNG file (`*_1.png`) — this confirms the CV fits on one page.
  - If two or more PNGs are produced, the CV is too long; trim content and re-render.

## Priority
If there is any conflict between stylistic freedom and structured consistency,
always prioritize:
1. required applicant fields
2. data consistency
3. RenderCV compatibility
4. realism
5. stylistic quality

---

# Job Requisition Generation

## Task
Generate Job Requisitions (Stellengesuche) for ERPNext HRMS based on real job postings provided by the user.

## Input
The user provides:
- A real job posting (text, URL, or document)
- Optionally: specific company, department, or location preferences

## Output
For each job posting, generate:
1. A structured **Job Requisition** dataset (YAML for ERPNext import)
2. A **Job Description** (Markdown) that can be used to create similar job postings

## Required Job Requisition Fields

Based on the ERPNext Job Requisition (Job Opening) DocType:

| Field | Fieldname | Type | Required | Notes |
|-------|-----------|------|----------|-------|
| Naming Series | `naming_series` | Select | ✅ | Format: `HR-HIREQ-XXXX` |
| Designation | `designation` | Link | ✅ | Job title |
| Department | `department` | Link | ✅ | e.g., "IT", "Engineering", "HR" |
| No of Positions | `no_of_positions` | Int | ✅ | Default: 1 |
| Expected Compensation | `expected_compensation` | Currency | ✅ | Market-appropriate for role/seniority |
| Location | `custom_location` | Link (Branch) | ✅ | German city/branch |
| Company | `company` | Link | ✅ | Default: fictional German company |
| Status | `status` | Select | ✅ | Default: `Open & Approved` |
| Employment Type | `custom_employment_type` | Link | ✅ | Full-time, Part-time, Contract, etc. |
| Posting Date | `posting_date` | Date | ✅ | Default: today |
| Expected By | `expected_by` | Date | ✅ | ~30-60 days from posting |
| Description | `description` | Text Editor | ✅ | Detailed job description |
| Reason for Requesting | `reason_for_requesting` | Text | | Optional: business justification |

## ID Rules
- Use ERPNext Naming Series format: `HR-HIREQ-0001`, `HR-HIREQ-0002`, ...
- Never reuse existing Job Requisition IDs
- Track used IDs in `job_openings/JobOpenings.csv`

## Job Description Rules
The generated description must:
- Be derived from the input job posting but rewritten (no direct copying)
- Include: role overview, responsibilities, requirements, benefits
- Be professional, clear, and ATS-friendly
- Be suitable for creating similar job postings
- Use German language by default (English if input is English)
- Quantify responsibilities where possible
- Avoid discriminatory language

## Compensation Guidelines
Use market-appropriate ranges for Germany (annual, EUR):
- Junior: 45.000 - 60.000
- Mid-level: 55.000 - 75.000
- Senior: 70.000 - 95.000
- Lead/Manager: 85.000 - 120.000+

Adjust based on role, location, and seniority.

## Storage Rules
Store generated Job Requisitions in:
```
job_openings/
  JobOpenings.csv              (central tracking file)
  {department}/                (e.g., it, engineering, hr)
    HR-HIREQ-0001_Position/
      HR-HIREQ-0001_Position.yaml    (ERPNext import)
      Position_Description.md        (job description)
```

## Consistency Rules
- Designation must match the job title from the posting
- Department must fit the role (e.g., Developer → IT/Engineering)
- Location must be a plausible German city/branch
- Employment Type must match the posting (full-time, contract, etc.)
- Description must align with the extracted responsibilities and requirements
- Status defaults to `Open & Approved` unless user specifies otherwise

## Variation Rules
- Vary departments, locations, and compensation across generations
- Avoid duplicate job descriptions
- Adapt tone and structure to the industry/role

## Standard Behavior for Generation Requests
When the user provides a job posting:
1. Extract key information (title, responsibilities, requirements, location)
2. Determine appropriate department, seniority, and compensation
3. Generate the Job Requisition YAML with all required fields
4. Create a rewritten Job Description in Markdown
5. Save both files in the correct folder structure
6. Update `job_openings/JobOpenings.csv`
7. Respond briefly with the designation, department, and file path

## Boundaries
- Do not copy text directly from real job postings (rewrite everything)
- Do not use real company names (use fictional German companies)
- Do not include real contact information
- Do not create discriminatory or biased content

## Priority
When generating Job Requisitions, prioritize:
1. Required ERPNext fields
2. Data consistency
3. Plausible fictional data
4. Professional quality
5. Rewrite originality

## Format Specification

### YAML Structure (ERPNext Import)
- Filename: `HR-HIREQ-XXXX_Position_Title.yaml`
- Location: `job_openings/{department}/HR-HIREQ-XXXX_Position_Title/`
- Description must be HTML-formatted with exactly two sections:
  - `<h2>Aufgaben</h2>` with `<ul>` list (5-8 bullet points)
  - `<h2>Anforderungen</h2>` with `<ul>` list (5-10 bullet points)
- No Benefits, no marketing, no contact information

### Markdown Structure (Internal Template)
- Filename: `Position_Title_Description.md`
- Header with all metadata fields (Designation, Department, Location, etc.)
- Two sections: `## Aufgaben` and `## Anforderungen`
- Bullet points only, no prose

### Content Rules
- Tasks: Start with action verbs, describe concrete activities
- Requirements: Distinguish must-have vs. nice-to-have, specify technologies
- No "About us", no benefits, no application process details
- Keep it concise and factual (internal document)

See `job_openings/JOB_REQUISITION_TEMPLATE.md` for complete format specification.

---

# Interview Feedback Generation

## Task
Generate realistic Interview Feedback texts for the "Screening und Kennenlernen" interview round.
The feedback is written as freetext HR interview notes – no ERPNext import structure, no skill ratings,
no summaries. Only the natural-language feedback text.

## Context
We have exactly two interview rounds:
1. **Screening und Kennenlernen** – standardized first interview with 8 fixed assessment criteria
2. **Fach- und Fit-Gespräch** – technical interview, criteria derived automatically from the job posting

This section covers only Runde 1 (Screening und Kennenlernen).

## Important: Separation of Concerns
- **Screening und Kennenlernen** evaluates soft skills only: motivation, communication, cultural fit,
  availability, career progression, language skills, self-reflection, and candidate questions.
  Technical evaluation stays **superficial** – note whether the CV has the right keywords and
  stations, but do NOT deep-dive into architecture decisions, tool-specific workflows, or
  technical problem-solving. Those aspects belong in Runde 2.
- **Fach- und Fit-Gespräch** is the technical deep-dive. Skill ratings, architecture discussions,
  coding/whiteboarding, tool-specific scenarios, and technical fit assessment happen there –
  not in the screening.

## Input
The agent has access to:
- The applicant's CV (RenderCV YAML)
- The applicant record in `applicants/Bewerber.csv`
- The job opening (if matched) in `job_openings/`
- The feedback template at `interview_feedback/INTERVIEW_FEEDBACK_TEMPLATE.md`

## Output Format
For each applicant, generate ONLY the feedback text – a plain text block following this structure:

```
Gesamteindruck: [1-2 Sätze, Tonfall, ein konkretes prägnantes Detail]

Stärken:
- [Konkretes Positiv mit Zahl, Fakt oder Zitat]
- [... 3-6 Punkte]

Schwächen:
- [Konkretes Negativ mit Beleg oder Aussage aus dem Gespräch]
- [... 2-5 Punkte, je nach Profil]

Kultur: [1-2 Sätze zu Werten, Team-Fit, Arbeitsstil, Persönlichkeit]

Logistik:
- Remote: [X Tage / Modell]
- Start: [Datum]
- Gehalt: [Betrag] ([Budget/Kommentar])
- Urlaub: [X Tage]

→ [Entscheidung + optional: Notiz für Runde 2]
```

## Output Storage
Store generated feedback as plain text files:

```
interview_feedback/
  InterviewFeedback.csv                 (central tracking)
  INTERVIEW_FEEDBACK_TEMPLATE.md        (this template)
  screening/
    APP-0001_Lea_Mueller/
      APP-0001_Lea_Mueller_Feedback.txt
    APP-0002_Thomas_Weber/
      APP-0002_Thomas_Weber_Feedback.txt
    ...
```

## The 8 Screening Criteria
Every feedback must implicitly cover these 8 aspects:

1. **Motivation** – Interest in the role, domain, and company
2. **Kommunikationsfähigkeit** – Clarity, structure, audience-appropriate expression
3. **Kulturelle Passung** – Value alignment, team fit, working style
4. **Verfügbarkeit** – Start date, work model (Remote/Hybrid/On-site), salary expectation within budget
5. **Beruflicher Werdegang** – Plausible career progression, explainable job changes, no critical gaps
6. **Sprachkenntnisse** – German and English, business fluent in spoken and written
7. **Selbstreflexion** – Realistic self-assessment of strengths and development areas
8. **Fragen des Kandidaten** – Preparation and genuine interest demonstrated through targeted questions

## Writing Style Rules
- Natural, informal – like real HR notes jotted down after an interview
- Short, punchy sentences; abbreviations ok ("bzw.", "m.M.n.", "ca.")
- Direct quotes from the candidate in quotation marks
- Evaluative but fair
- Action-oriented: the decision must be clear by the end

## Concreteness Rules
- ALWAYS reference concrete numbers, dates, and facts from the CV
- State salary expectation, start date, remote preference, vacation days
- Mention company names and career stations from the CV
- For career changers: explicitly name the gap to the target profile
- Never write abstract ("good experience") – write specific ("built Terraform modules for 50+ services")

## Variation Rules
- EVERY feedback must read differently
- Vary focus areas (some emphasize culture, others technical depth, others personality)
- Vary phrasing for similar observations
- Describe different personality types (reserved vs. dominant vs. enthusiastic)

## Decision Logic
- **Weiter zu Runde 2:** Candidate fits, minor concerns acceptable
- **Tendenz eher Nein:** Mixed impression, could invite to technical round but skepticism remains
- **Absage:** KO criterion violated (wrong profile, too little experience, culture mismatch, salary too high)
- **Vormerken für andere Rolle:** Doesn't fit this position, but profile interesting for other/future roles

## Standard Behavior for Generation Requests
When the user asks to generate interview feedback:
1. Read the applicant's CV from the appropriate directory
2. Identify which job opening the applicant is matched to (if any)
3. Study the job opening requirements for context
4. Generate the feedback text following the template format
5. Create the applicant subdirectory under `interview_feedback/screening/`
6. Save the feedback as `APP-XXXX_Vorname_Nachname_Feedback.txt`
7. Update `interview_feedback/InterviewFeedback.csv`
8. Respond briefly with applicant name, decision, and file path

## Rating Rules
- Include a star rating for each of the 8 screening criteria at the very end of the feedback text,
  after the decision arrow.
- Format:
  ```
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
- Use filled (★) and empty (☆) stars on a 5-star scale.
- Ratings must align with the strengths and weaknesses described in the feedback text.
- No numeric scores (e.g., "4/5") – stars only.

## Realism Enforcement Rules
These rules override any stylistic polish in favor of raw authenticity:

### Tone
- Write like someone typing notes 5 minutes after the interview ended – not a report, not an essay
- Telegraphic sentences, incomplete sentences where natural ("Kein Selbstdarsteller, braucht Team das ihn abholt.")
- Opinionated: "m.M.n.", "ehrlich gesagt", "naja", "weiß nicht recht..."
- No formal language: "er" not "der Kandidat" (after first mention), colloquial phrasing

### Abbreviations (MUST USE FREQUENTLY)
- m.M.n. (meiner Meinung nach)
- bzgl. (bezüglich)
- evtl. / ggf. (eventuell / gegebenenfalls)
- eig. (eigentlich)
- ca. (circa)
- tw. (teilweise)
- bisschen / bissl
- Standard abbreviations: z.B., u.a., etc., d.h.

### Structure
- Each bullet point MAX 1-2 lines – if longer, split it
- No explanatory preamble or conclusion within bullet points – just the observation
- Punctuation in bullets: either all have periods or none – be consistent within a file
- Empty line between major sections

### Candidate Quotes
- At least 2-3 direct quotes with quotation marks per feedback
- Quotes must sound like real spoken German, not CV text
- Capture filler words and natural breaks where appropriate

### Self-Check (run this before writing the file)
- [ ] Does this sound like someone writing after a long day of interviews? (not a polished document)
- [ ] Are there at least 5 abbreviations in the text?
- [ ] Are there at least 2 direct quotes from the candidate?
- [ ] Is every strength/weakness backed by a concrete number, date, or fact from the CV?
- [ ] Is Kultur MAX 2 short sentences?
- [ ] Is the decision arrow unambiguous and has a clear note for Runde 2?

### Anti-Patterns (WILL KILL REALISM)
- ❌ "Der Kandidat verfügt über umfassende Erfahrung in..." → "Hat 3 Jahre K8s gemacht, weiß wovon er redet"
- ❌ "Die Kommunikationsfähigkeiten sind als entwicklungsfähig einzustufen" → "redet zu leise, muss man pushen"
- ❌ "Sein Werdegang zeichnet sich durch eine stringente Logik aus" → "Werdegang sauber, keine Lücken"
- ❌ Multi-clause sentences with commas and subclauses in bullet points
- ❌ Any HR jargon like "Skill-Gap", "Onboarding-Prozess", "Entwicklungspotenzial" (use plain German)
- ❌ Describing the process instead of the observation: "Auf Nachfrage gab er an..." → just state what he said

## Boundaries
- Do NOT generate Interview records or Interview Feedback records for ERPNext
- Do NOT generate skill assessment tables or ratings inside feedback files
- Do NOT use real personal data
- Do NOT write generic, vague feedback
- Do NOT create duplicate or near-identical feedback texts
- The feedback must be in German

## Fach- und Fit-Gespräch Output
When generating feedback for Runde 2 (Fach- und Fit-Gespräch):
- Structure the feedback by the expected skill areas from the interview round data.
- Each skill area gets ONE dense paragraph – NO bullet points, NO structured lists.
- Output file: `APP-XXXX_Vorname_Nachname_Fachgespraech.txt` under `interview_feedback/fachgespraech/`.
- Keep it short and raw – real interview notes, not a polished report. Abbreviations, incomplete
  sentences, quick observations. No intros, no formal formatting, no summaries per section.
- MUST end with a **Fazit** paragraph (overall assessment) followed by a **decision line** (e.g., "Empfehlung." or "Absage." with optional note).
- After the decision line, append a **Skill Assessment** block with star ratings for each expected skill area,
  using the exact skill names from the interview round data.
- No symbols (arrows, stars, ratings) in the feedback text body – only in the Skill Assessment block.
- Reference example: `interview_feedback/fachgespraech/APP-0009_Maximilian_Richter/APP-0009_Maximilian_Richter_Fachgespraech.txt`

### Format Template (MANDATORY)
```
[Skill-Area-Name]: [Fragments, observations, concrete facts. No complete sentences. Abbreviations. Judgment at the end.]

[Skill-Area-Name]: [Fragments, observations, concrete facts. No complete sentences. Abbreviations. Judgment at the end.]

[...]

Fazit: [Overall assessment, 2-4 sentences. Decision reasoning.]

[Entscheidung]. [Optional: note for future reference.]
```

### Anti-Patterns for Fachgespräch
- ❌ Bullet points (use paragraph chunks, each statement separated by period)
- ❌ Structured lists with dashes
- ❌ "Der Kandidat zeigt gute Kenntnisse in..." → "K8s sitzt, Helm selbst geschrieben"
- ❌ Polite hedging ("könnte", "sollte eventuell") → blunt assessment
- ❌ Missing Fazit or decision line at end

## Priority
When generating Interview Feedback, prioritize:
1. Realism (reads like actual HR notes)
2. Concreteness (specific CV details, numbers, quotes)
3. Variation (each feedback unique)
4. Decision clarity (outcome is unambiguous)
5. Consistency with the applicant's CV profile