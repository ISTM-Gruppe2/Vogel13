---
name: generate-fachgespraech-feedback
description: Use when the user asks to generate Fachgespräch feedback (Runde 2) for an applicant in the bachelorproject recruitment system. Creates realistic German freetext HR interview notes for the technical deep-dive round with skill-area paragraphs.
---

# Generate Fachgespräch Feedback

## Kontext

This skill generates realistic interview feedback for the second round — **Fach- und Fit-Gespräch** — as freetext HR notes (no ERPNext import). The feedback evaluates technical skill areas in dense paragraph form with a concluding Fazit and decision. All feedback is written in German, stored in `dummy_data/interview_feedback/fachgespraech/`. All paths in this skill are relative to the workspace root.

**Prerequisite**: Screening feedback (Runde 1) must already exist for the applicant before generating Fachgespräch feedback.

## Pre-Generation Checks

Before generating feedback, always:
1. Read `dummy_data/interview_feedback/InterviewFeedback.csv` to find the **next available feedback ID** (`FB-XXXX`) and avoid duplicates. Also verify a Screening record exists for this applicant (Round = `Screening`, Decision = `Weiter zu Runde 2`).
2. Check whether Fachgespräch feedback already exists for this applicant (search `fachgespraech/APP-XXXX_*` directories).
3. Determine the next ID: highest existing `FB-XXXX` + 1.
4. Read the applicant's screening feedback to understand what was already noted and what the screening decision was about.

## Identify Parameters

Ask or determine:
- **Applicant ID** (e.g., `APP-0009`) — which applicant to generate feedback for.
- **Job opening match** (optional): if the applicant is matched to a specific `HR-HIREQ-XXXX`, use that for skill area context. The job opening's required skills/technologies determine the Fachgespräch skill areas.
- **Career changer** (check CV): if the applicant's background differs from the target role, treat them as a career changer (see Career Changer Rules).

## Input Sources

Read these before generating, **in this order**:

| # | Source | Path | Provides |
|---|--------|------|----------|
| 1 | Feedback CSV | `dummy_data/interview_feedback/InterviewFeedback.csv` | Next ID, screening decision/notes, Role/Department |
| 2 | Applicant CSV | `dummy_data/applicants/Bewerber.csv` | Name, Email, City |
| 3 | Applicant CV | `dummy_data/applicants/{role}/APP-XXXX_FirstName_LastName/APP-XXXX_FirstName_LastName_CV.yaml` | Companies, dates, skills, career stations — the concrete facts for evaluating technical depth. Extract **role** and **seniority** for decision calibration. |
| 4 | Job opening | `dummy_data/job_openings/{department}/HR-HIREQ-XXXX_Position/` (if matched) | Target role, department name, required skills — used for gap analysis and skill area names. The `department` field goes into InterviewFeedback.csv. |
| 5 | Interview Round JSON | Provided by user in the prompt (optional) | **Definitive list of `expected_skill_set` entries** — determines the exact skill names for the Skill Assessment block. If provided, these names OVERRIDE all other sources for the Skill Assessment block. |
| 6 | Screening feedback | `dummy_data/interview_feedback/screening/APP-XXXX_FirstName_LastName/APP-XXXX_FirstName_LastName_Feedback.txt` | Context from Runde 1 — what was already praised or flagged |
| 7 | Reference example | `dummy_data/interview_feedback/fachgespraech/APP-0009_Maximilian_Richter/APP-0009_Maximilian_Richter_Fachgespraech.txt` | Tone calibration for raw paragraph style, abbreviation usage, paragraph density |

## Generation Process

### Output

**Output filename**: `APP-XXXX_FirstName_LastName_Fachgespraech.txt`
**Directory**: `dummy_data/interview_feedback/fachgespraech/APP-XXXX_FirstName_LastName/`

### Format

Exact structure, plain text:

```
[Skill-Area-Name]: [Fragments, observations, concrete facts. No complete sentences. Abbreviations. Judgment at the end.]

[Skill-Area-Name]: [Fragments, observations, concrete facts. No complete sentences. Abbreviations. Judgment at the end.]

[...]

Fazit: [Overall assessment, 2-4 sentences. Decision reasoning.]

[Entscheidung]. [Optional: note for future reference.]

Skill Assessment:
- [Skill-Area-Name]: ★★★★☆
- [Skill-Area-Name]: ★★★☆☆
[...]
```

### Skill Areas

Skill areas derive from (in priority order):
1. **Primary**: If the user provides an Interview Round JSON with `expected_skill_set`, extract the `skill` field from each entry and use those exact names verbatim. These are the definitive skill area names for the Fachgespräch and the Skill Assessment block. Do NOT rephrase or rename.
2. **Secondary**: The job opening's required skills/technologies (from the YAML file under `dummy_data/job_openings/{department}/HR-HIREQ-XXXX_Position/` — read the description or requirements section). Use the exact skill/topic names as they appear in the job opening.
3. **Fallback** (no job opening matched, no interview round JSON): Derive from the applicant's CV — use the `cv.sections.experience` technologies and `cv.sections.skills` categories (e.g., "Kubernetes/Docker", "CI/CD", "Observability").

### Paragraph Rules (CRITICAL)

- Each skill area gets ONE dense paragraph — **MAX 2-4 short sentences/fragments**. No essays, no explanations, no multi-clause justifications.
- Keep it short and raw — real interview notes jotted down after a long day. Abbreviations, incomplete sentences, quick observations.
- Every sentence must reference a concrete fact, number, or quote from the CV. Cut everything else.
- No symbols (arrows, stars, ratings) in the feedback body — only in the Skill Assessment block at the end.
- Reference example: `dummy_data/interview_feedback/fachgespraech/APP-0009_Maximilian_Richter/APP-0009_Maximilian_Richter_Fachgespraech.txt` — match its density. 2-4 lines per skill area, never more.

### Length Self-Check (MANDATORY)

Before writing, count lines per skill-area paragraph:
- ❌ 5+ sentences → **too long, rewrite tighter**
- ❌ Explanatory sentences ("Das ist typisch für...", "Das zeigt dass...") → **cut, just state the observation**
- ✅ 2-4 short fragments per skill area → correct density
- ✅ Raw, choppy, no filler → correct style

### Decision Logic

- `Empfehlung` — Strong technical fit, proceed with offer
- `Empfehlung mit Bedenken` — Generally good, but noted gaps to address
- `Absage` — Technical mismatch or dealbreakers confirmed

### Skill Assessment

After the Entscheidung line, append star ratings (★☆) for each skill area. Ratings must align with the paragraph assessments. No numeric scores. Skill names must match the `expected_skill_set` entries from the interview round JSON exactly (if provided), or the derived skill area names.

## Career Changer Rules

If the applicant's CV shows a background that differs from the target role:
- Explicitly name the gap in the Fazit and relevant skill area paragraphs.
- Assess whether transferable skills exist or whether the gap is a true blocker.
- Be specific: name the missing technologies or domain knowledge, not abstract "fehlende Erfahrung".
- The decision should reflect whether the gap is bridgeable (→ Empfehlung mit Bedenken) or fatal (→ Absage).

## Writing Style Rules

### Tone (REALISM IS THE #1 PRIORITY)
- Write like someone typing notes 5 minutes after the interview — not a report, not an essay.
- Telegraphic, incomplete sentences where natural: "Kein Selbstdarsteller, braucht Team das ihn abholt."
- Opinionated: "m.M.n.", "ehrlich gesagt", "naja", "weiß nicht recht..."
- No formal language: "er" not "der Kandidat" (after first mention), colloquial phrasing.
- **Raw paragraphs only** — no section headers beyond skill area names.

### Abbreviations (MUST USE FREQUENTLY)
m.M.n., bzgl., evtl./ggf., eig., ca., tw., bisschen/bissl, z.B., u.a., etc., d.h.

### Concreteness Rules
- ALWAYS reference concrete numbers, dates, and facts from the CV.
- Mention company names and career stations from the CV.
- Never write abstract ("good experience") — write specific ("Terraform-Module für 50+ Services geschrieben").
- For career changers: explicitly name the gap ("Als IT-Systemadministrator kein Cloud-natives Know-how — für Platform Engineering fehlen K8s, IaC, CI/CD").

### Candidate Quotes
- At least 2-3 direct quotes with quotation marks per feedback.
- Quotes must sound like real spoken German, not CV text.
- Capture filler words and natural breaks where appropriate.

### Self-Check (Before Writing Output)
- Are all skill-area paragraphs MAX 2-4 sentences? If any paragraph has 5+ sentences → REWRITE tighter.
- Does this sound like someone writing after a long day of interviews?
- Are there at least 5 abbreviations in the text?
- Are there at least 2 direct quotes from the candidate?
- Is every observation backed by a concrete number, date, or fact from the CV?
- Is there a Fazit paragraph? A decision line? A Skill Assessment block?
- Are the Skill Assessment names exactly matching the `expected_skill_set` entries from the interview round JSON? (If JSON was provided.)
- Are there NO bullet points in the feedback body? Only dense paragraphs per skill area?
- Are there NO symbols (stars, arrows, ratings) in the body — only in the Skill Assessment block?

### Anti-Patterns (AVOID — Will Kill Realism)
- ❌ "Der Kandidat verfügt über umfassende Erfahrung in..." → "Hat 3 Jahre K8s gemacht, weiß wovon er redet"
- ❌ "Die Kommunikationsfähigkeiten sind als entwicklungsfähig einzustufen" → "redet zu leise, muss man pushen"
- ❌ Multi-clause sentences with commas and subclauses
- ❌ HR jargon: "Skill-Gap", "Onboarding-Prozess", "Entwicklungspotenzial" (use plain German)
- ❌ Describing the process instead of the observation: "Auf Nachfrage gab er an..." → just state what he said
- ❌ Bullet points (use paragraph chunks only)
- ❌ Missing Fazit or decision line at end
- ❌ Repeating screening-level soft-skill observations — Fachgespräch is technical. If the candidate's communication was poor, that was covered in screening. Only mention if severely impacting technical discussion.

## Variation Rules

- EVERY feedback must read differently — vary phrasing, focus areas, personality descriptions.
- Vary which skill areas get more depth.
- Vary the tone of the Fazit (enthusiastic vs. cautious vs. disappointed).

## Save & Track

1. Create the output directory if it doesn't exist:
   - `dummy_data/interview_feedback/fachgespraech/APP-XXXX_FirstName_LastName/`
2. Write the feedback text file.
3. Append a new row to `dummy_data/interview_feedback/InterviewFeedback.csv`:
   - Format: `FB-XXXX,APP-XXXX,FirstName LastName,Role,Department,Fachgespräch,Decision,YYYY-MM-DD`
   - **Round**: Always `Fachgespräch`.
   - **Role**: From the applicant's CV (job title / target role directory name). Same value as the existing rows for this applicant in InterviewFeedback.csv.
   - **Department**: From the job opening's department field (if matched). If no job opening matched, use the department from existing rows for this applicant in InterviewFeedback.csv.
   - Use today's date.

## Response

Reply concisely with:
- Applicant name and ID
- Round (Fachgespräch)
- Decision
- File path

## Boundaries

- Do NOT generate ERPNext Interview records or Interview Feedback records — freetext only.
- Do NOT use real personal data.
- Do NOT write generic, vague feedback.
- Do NOT create duplicate or near-identical feedback texts.
- Feedback must be in German.
- Do NOT include skill assessment tables or numeric ratings inside the feedback body — only star ratings in the Skill Assessment block.
- Do NOT write soft-skill screening content — that belongs to Runde 1 (generate-screening-feedback skill). Fachgespräch is technical.

## Priority

1. Realism (reads like actual HR notes)
2. Concreteness (specific CV details, numbers, quotes)
3. Variation (each feedback unique)
4. Decision clarity (outcome is unambiguous)
5. Consistency with the applicant's CV profile and screening feedback