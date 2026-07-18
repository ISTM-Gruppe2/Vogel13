---
name: generate-job-opening
description: Use when the user asks to generate a new job opening (Stellengesuch) or job requisition for the bachelorproject recruitment system. Creates a structured YAML file for ERPNext import, a Markdown job description, and updates the central CSV tracker.
---

# Generate Job Opening (Stellengesuch)

## Kontext

This skill generates fictional job openings (Stellengesuche) for ERPNext HRMS-based recruiting demos. Each job opening consists of a structured YAML file for ERPNext import, a Markdown job description, and a CSV tracker row, stored in `dummy_data/job_openings/`.

**Primary reference**: The complete rules live in `dummy_data/AGENTS.md` and `dummy_data/job_openings/JOB_REQUISITION_TEMPLATE.md`. When in doubt about any rule, boundary, or format, read those files first. This skill is a distillation, not a replacement.

**Format reference**: Study an existing job opening before writing. Good references are:
- `dummy_data/job_openings/cyber-security/HR-HIREQ-0001_Cyber_Security_Consultant_OT/`
- `dummy_data/job_openings/it/HR-HIREQ-0002_Platform_Engineer/`

## Pre-Generation Checks

Before generating a new job opening, always:
1. Read `dummy_data/job_openings/JobOpenings.csv` to find the **next available ID** (`HR-HIREQ-XXXX`) and check for duplicate designations or locations.
2. Determine the next ID: highest existing `HR-HIREQ-XXXX` + 1.
3. Check which departments already have openings (via the `{department}/` subdirectories) to avoid concentration.

## Identify Parameters

Ask or determine:
- **Position title** (e.g., "Senior Java Developer (SpringBoot)", "Platform Engineer") – if not given, propose 3 suitable designations fitting common ERPNext recruiting demo roles.
- **Department** (e.g., IT, Engineering, HR, Finance, Marketing, Operations) – derived from the role.
- **Seniority**: Junior (0–2y), Mid-level (2–5y), Senior (5–8y), Lead (7+y) – determines compensation and requirement depth.
- **Location**: Any plausible German city (Essen, München, Berlin, Hamburg, Köln, Frankfurt, Stuttgart, etc.).
- **Employment type**: Full-time (default), Part-time, Contract, or Working Student.
- **Company**: A fictional German company name – must differ from existing openings.
- **Number of positions**: Default 1.
- **Language**: Default German. English if the role or user request clearly calls for it.
- **Source**: Optionally, the user may provide a real job posting URL or text. Extract key info but rewrite everything – no direct copying.

## Generation Process

### 1. YAML File (ERPNext Import)

**Filename**: `HR-HIREQ-XXXX_Position_Title.yaml` (use underscores, no spaces)
**Directory**: `dummy_data/job_openings/{department-slug}/HR-HIREQ-XXXX_Position_Title/`

**Structure**:
```yaml
naming_series: HR-HIREQ-XXXX
designation: <Positionstitel>
department: <Abteilung>
no_of_positions: <Anzahl>
expected_compensation: <Gehalt in EUR>
custom_location: <Standort>
company: <Fiktiver Firmenname>
status: Open & Approved
custom_employment_type: Full-time
posting_date: YYYY-MM-DD
expected_by: YYYY-MM-DD
description: |
  <h2>Aufgaben</h2>
  <ul>
    <li>Aufgabe 1</li>
    ...
  </ul>

  <h2>Anforderungen</h2>
  <ul>
    <li>Anforderung 1</li>
    ...
  </ul>
reason_for_requesting: <optional business justification>
```

**YAML field rules**:
- `naming_series`: `HR-HIREQ-XXXX` (zero-padded 4-digit number).
- `designation`: Exact job title. Include seniority prefix in the title if relevant (e.g., "Senior Java Developer").
- `department`: Use the department name as it appears in ERPNext HR (e.g., "IT", "Engineering", "HR", "Finance").
- `no_of_positions`: Integer, default 1.
- `expected_compensation`: Integer (no thousand separator, no currency symbol). Follow compensation guidelines.
- `custom_location`: German city name only (e.g., "Berlin").
- `company`: Fictional German company name ending in "GmbH", "AG", "SE", or "KG". Must differ from existing openings.
- `status`: Default `Open & Approved`. Other valid values: `Pending`, `Rejected`, `Filled`, `On Hold`, `Cancelled`.
- `custom_employment_type`: `Full-time`, `Part-time`, `Contract`, or `Working Student`.
- `posting_date`: Today's date (YYYY-MM-DD).
- `expected_by`: 30-60 days after posting date.
- `description`: HTML block with exactly two `<h2>` sections. Use `|` (literal block scalar) after `description:`.
- `reason_for_requesting`: Optional field. When included, provide a plausible business justification in German (1 sentence).

**Description content rules**:
- **Aufgaben** (5–8 bullet points): Start with action verbs (Organisation, Entwicklung, Betreuung, ...). Describe concrete activities. Quantify where possible (e.g., "Verwaltung von 50+ Systemen").
- **Anforderungen** (5–10 bullet points): Distinguish must-have vs. nice-to-have. Name concrete technologies/tools. Specify language proficiency (always include German + English). Mention certifications as "von Vorteil". Mention travel willingness if realistic.
- Must NOT contain: Benefits/Sozialleistungen, "Über uns" texts, marketing language, application process details, contact information.
- All content in German by default.

### 2. Markdown Description (Internal Template)

**Filename**: `Position_Title_Description.md`
**Directory**: Same as YAML file.

**Structure**:
```markdown
# <Positionstitel> (w/m/d)

**Designation:** <Positionstitel>  
**Department:** <Abteilung>  
**Location:** <Standort> (<Arbeitsmodell>)  
**Employment Type:** <Anstellungsart>  
**No. of Positions:** <Anzahl>  
**Expected Compensation:** <Gehalt> EUR  
**Status:** <Status>  
**Posting Date:** <Datum>  
**Expected By:** <Datum>

---

## Aufgaben

- Aufgabe 1
- Aufgabe 2
...

## Anforderungen

- Anforderung 1
- Anforderung 2
...
```

**Rules for the Description.md**:
- Header includes (w/m/d) suffix on the designation.
- Location includes a working model in parentheses: (Hybrid), (Remote), (Vor Ort), (Flexibel).
- Expected Compensation formatted with thousands separator: e.g., `75.000 EUR`.
- Aufgaben and Anforderungen lists must exactly match the YAML description content (same items, just in Markdown bullet format instead of HTML `<li>` tags).
- No introductory prose, no conclusion – just the header metadata and the two lists.

### 3. Update JobOpenings.csv

Append a new row to `dummy_data/job_openings/JobOpenings.csv`:

```csv
HR-HIREQ-XXXX,<Designation>,<Department>,<Location>,<Employment Type>,<Status>,<Company>,<Posting Date>,<Expected Compensation>
```

**CSV format rules**:
- Columns: `ID,Designation,Department,Location,Employment Type,Status,Company,Posting Date,Expected Compensation`
- Expected Compensation: Integer, no formatting.
- If any field contains a comma, wrap the entire field in double quotes.
- No trailing commas, no header row duplication.

## Compensation Guidelines (Germany, Annual EUR)

| Seniority | Range | Typical |
|-----------|-------|---------|
| Junior | 45.000 - 60.000 | 50.000 |
| Mid-level | 55.000 - 75.000 | 65.000 |
| Senior | 70.000 - 95.000 | 80.000 |
| Lead/Manager | 85.000 - 120.000+ | 95.000 |

Adjust upward for high-cost cities (München, Frankfurt, Stuttgart) and niche roles. Adjust downward for part-time or working student roles.

## Seniority & Content Calibration

The seniority drives the depth and specificity of the Anforderungen section:

- **Junior (0–2y)**: Requirements stress education, foundational knowledge, and willingness to learn. Technologies listed as "Grundkenntnisse" or "erste Erfahrung". Certifications optional. Compensation in the 45k–60k range.
- **Mid-level (2–5y)**: Requirements specify concrete experience (e.g., "3+ Jahre Erfahrung mit..."). Specific tools and frameworks named. Certifications "von Vorteil". Compensation 55k–75k.
- **Senior (5–8y)**: Requirements include "mehrjährige" or "umfassende Erfahrung", leadership nuances, mentoring expectations. Architecture/design responsibilities. Compensation 70k–95k.
- **Lead (7+y)**: Requirements include team leadership, budget responsibility, stakeholder management, strategic planning alongside technical depth. Compensation 85k–120k+.

## Variation Rules

Every new job opening must differ from existing ones in:
- Company name
- Location
- Compensation (within reasonable range for seniority)
- Role focus and technology stack
- Department distribution (don't concentrate all openings in one department)
- Specific technologies and tools in the requirements

Before writing, check existing openings in the same department directory to avoid repetitive patterns.

## Save & Verify

1. Create the directory structure: `dummy_data/job_openings/{department-slug}/HR-HIREQ-XXXX_Position_Title/`
2. Write the YAML file.
3. Write the Description.md file.
4. Append the CSV row to `JobOpenings.csv`.
5. Verify:
   - YAML is valid (key structure correct, HTML in description well-formed).
   - Description.md exactly mirrors YAML content (Aufgaben/Anforderungen lists match).
   - CSV row is complete (9 columns, no missing fields).
   - All dates in YYYY-MM-DD format.
   - Expected By is after Posting Date.
   - ID is unique (not already in JobOpenings.csv).
   - Compensation fits seniority range.

## Response

Reply concisely with:
- Designation and ID
- Department and location
- Seniority (implicit via compensation if not explicit in title)
- File paths (YAML + Description.md)

## Completion Checklist

Before declaring the generation complete, verify:
- [ ] All required YAML fields are present and non-empty.
- [ ] ID is unique (not reused) and follows `HR-HIREQ-XXXX` format.
- [ ] Designation does not duplicate any existing opening in `JobOpenings.csv`.
- [ ] Company name is fictional (German GmbH/AG/SE/KG) and differs from existing.
- [ ] Location is a plausible German city.
- [ ] Description contains exactly two `<h2>` sections: Aufgaben and Anforderungen.
- [ ] Aufgaben has 5–8 items, Anforderungen has 5–10 items.
- [ ] HTML in YAML description is well-formed (no unclosed tags).
- [ ] Description.md mirrors YAML content exactly (same bullets, same order).
- [ ] Description.md header includes (w/m/d) and all metadata fields.
- [ ] No Benefits, marketing text, "Über uns", or contact info in either file.
- [ ] Compensation is an integer, within seniority range.
- [ ] German + English language requirements are stated.
- [ ] Dates are in YYYY-MM-DD format; expected_by > posting_date.
- [ ] CSV row appended to JobOpenings.csv with all 9 columns.
- [ ] Directory structure follows `{department-slug}/HR-HIREQ-XXXX_Position_Title/`.

## Boundaries

- No real company names – always use fictional German companies.
- No direct copying from real job postings – rewrite everything.
- No real contact information.
- No discriminatory or biased language.
- No Benefits or marketing content – this is an internal requisition, not a public job ad.
- Do not reuse existing IDs.
- Do not create duplicate designations.
- Description is HTML in YAML and Markdown in the .md file – both must exist.

## Priority

When rules conflict, prioritize:
1. Required YAML fields (ERPNext compatibility)
2. Data consistency (YAML ↔ Description.md ↔ CSV)
3. Plausible fictional data
4. Realistic role requirements
5. Variation and uniqueness