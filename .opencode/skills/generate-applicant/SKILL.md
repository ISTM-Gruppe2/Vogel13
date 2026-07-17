---
name: generate-applicant
description: Use when the user asks to generate a new dummy applicant for the bachelorproject recruitment system. Creates a fictional applicant profile with structured record and RenderCV YAML resume.
---

# Generate Dummy Applicant

## Context

This skill generates fully fictional applicant profiles for ERPNext-based recruiting demos. Each applicant consists of a structured CSV record and a RenderCV YAML resume, stored in `dummy_data/applicants/`.

**Primary reference**: The complete rules live in `dummy_data/AGENTS.md`. When in doubt about any rule, boundary, or format, read that file first. This skill is a distillation, not a replacement.

**Format reference**: If exists, study an existing applicant before writing.

## Pre-Generation Checks

Before generating a new applicant, always:
1. Read `dummy_data/applicants/Bewerber.csv` to find the **next available ID** and check for duplicate last names.
2. Glob existing applicant directories: `dummy_data/applicants/{role}/APP-*/` to confirm no collision and to study existing CV patterns in that role.
3. Determine the next ID: highest existing `APP-XXXX` + 1.

## Identify Parameters

Ask or determine:
- **Target role** (e.g., Cloud Platform Engineer, Backend Software Engineer) – if not given, propose 3 suitable roles.
- **Seniority**: Junior (0–2y), Mid-level (2–5y), Senior (5–8y), Lead (7+y).
- **Language**: Default German; English if role/user request clearly calls for it.
- **Gender** (optional): vary male/female if not specified.
- **Career changer** (optional): if requested, background must differ from target role with visible gaps.

## Language vs. Locale

Two distinct concepts – do not conflate them:

| Concept | Controls | Example values |
|---------|----------|---------------|
| Content language | The actual text in CV fields (highlights, summaries, section names) | German (default), English |
| `locale.language` | RenderCV UI labels and date formatting | `english`, `de` |

- The content language follows the AGENTS.md Language Rule (German default).
- `locale.language` should match the content language (`de` for German content, `english` for English content).
- Technical terms (Kubernetes, Terraform, CI/CD) stay English regardless – this is industry standard.

## Generation Process

### 1. Applicant Record (CSV row)

Fields: `ID`, `Status`, `First Name`, `Last Name`, `Street`, `City`, `Postal Code`, `Country`, `Nationality`, `Email Address`, `Phone Number`

Rules:
- Status defaults to `New`.
- All addresses in Germany: realistic German street names, German cities, +49 phone numbers, `.de` email domains.
- First Name, Last Name, City, Country must exactly match the CV.
- Everything fictional – no real personal data.
- Use commas as CSV separator. If a field value contains a comma, wrap the entire field in double quotes.

Append the new row to `dummy_data/applicants/Bewerber.csv`.

### 2. RenderCV YAML Resume

Create the YAML file `APP-XXXX_FirstName_LastName_CV.yaml` inside `dummy_data/applicants/{role-slug}/APP-XXXX_FirstName_LastName/`. The role-slug is lowercase with hyphens (e.g., `cloud-platform-engineer`, `backend-software-engineer`).

**File must start with**:
```yaml
# yaml-language-server: $schema=https://github.com/rendercv/rendercv/blob/main/schema.json?raw=true
```

**Top-level structure**:
```yaml
cv:
  name: FirstName LastName
  location: City, Germany
  email: ...
  phone: +49 ...
  website: (optional GitHub/website)
  social_networks: (optional LinkedIn)

  sections:
    experience:    # 2-4 entries, 3-5 quantified bullet points each
    projects:      # optional, separate section with summary + highlights
    education:     # 1-2 entries
    skills:        # optional, compact
    certificates:  # optional, compact

design:
  theme: classic

locale:
  language: german  # or english, must match content language (RenderCV uses ISO code 'de' as 'german')

settings:
  current_date: today
```

**Experience section** (largest, most detailed):
- 2–4 entries with company, position, dates, location, highlights (3–5 bullets).
- Bullet points must be quantified (percentages, numbers, time savings).
- Use action verbs, specific technologies and methodologies.
- Seniority determines total years and depth:
  - Junior: 0–2 years → internships, working student roles, university projects.
  - Mid-level: 2–5 years → 1–2 full roles + earlier positions.
  - Senior: 5–8 years → 2–3 progressive roles, leadership nuances.
  - Lead: 7+ years → senior roles + team/tech lead experience.

**Projects section** (optional but recommended):
- Separate section with `name`, `start_date`, `end_date`, `location`, `summary`, `highlights`.
- Quantified outcomes. Separate from experience – do not merge into experience entries.

**Education section**:
- 1–2 entries: university degree + Abitur.
- Abbreviated degrees: "B.Sc.", "M.Sc.", "PhD". Field of study in `area`, not in `degree`.
- GPA only if 1.0–2.5 (German scale). Omit otherwise.
- Minimal description unless notable achievements exist (e.g., thesis title, specialization).

**Skills section** (optional, compact, ~25–30% of standard section size):
- Format: `- label: Category\n  details: 'Skill1, Skill2, ...'`
- Only include skills relevant to the target role.
- Mandatory language proficiency: German + English with CEFR levels (e.g., "Deutsch (Muttersprache)", "Englisch (C1)").
- Languages go into a dedicated `- label: Sprachen` skill entry.

**Certificates** (optional):
- Format: `- bullet: 'Cert Name (Year)'`
- Only include if relevant and space permits.

**Plausibility rules**:
- Timelines must be logically consistent (no unexplained gaps >6 months).
- Resume must fill approximately one page – detailed enough, not sparse.
- ATS-friendly: concise, professional, no decorative language.
- Career changers: no relevant experience for target role, visible gap. Education may or may not match.

**Filling the page for Junior / entry-level profiles**:
Junior applicants (0–2 years) have limited work experience, making the single-page target harder. Compensate with:
- **Expand the projects section**: List 2–3 detailed university or personal projects with quantified outcomes. These carry more weight for juniors and fill space naturally.
- **List university roles as experience**: Working student jobs, research assistant positions, and internships all count. Fictionalize realistic entry-level roles.
- **Add more detail to education**: Include thesis title, specialization, relevant coursework, or notable academic achievements.
- **Use the skills section**: For juniors, the skills section is not optional – include 3–5 skill categories to demonstrate breadth.
- **Avoid padding**: Never add filler text or generic bullets. Every bullet must be concrete and role-relevant.

**Radio buttons for content language**:
- German (default): Use `locale.language: german`, content in German. Company names, degree names, section labels in German. Skill/technology names in English.
- English: Use `locale.language: english`, content in English. Company names, degree labels, section labels in English.

### 3. Save & Render

1. Write the YAML file into the correct directory structure (create directories as needed).
2. Render the CV. Choose the method based on what output formats are needed:

   **Option A: Project runner script** (preferred for PDF-only output)
   ```bash
   PYTHONIOENCODING=utf-8 python dummy_data/rendercv_runner.py "dummy_data/applicants/{role-slug}/APP-XXXX_Name/APP-XXXX_Name_CV.yaml"
   ```
   Produces: `.tex` + `.pdf`. No PNG/HTML output. Faster and avoids RenderCV CLI encoding issues on Windows.

   **Option B: RenderCV CLI** (use when PNG/HTML/MD/Typst outputs are needed, or for the 1-page check)
   ```bash
   PYTHONIOENCODING=utf-8 python -m rendercv render "APP-XXXX_Name_CV.yaml"
   ```
   (Run from the YAML file's directory. Output goes to `rendercv_output/`.) Produces: PDF, PNG, HTML, MD, Typst.

3. Verify the result:
   - PDF was produced successfully (both methods).
   - **1-page verification**:
     - If using Option B (CLI): check `rendercv_output/` contains exactly ONE `*_1.png`. If 2+ PNGs exist, the CV is too long; trim content and re-render.
     - If using Option A (runner): visually inspect the generated PDF to confirm it fits one page. The runner produces no PNG files, so this check is manual.
   - If both methods fail or produce multi-page output, trim content: reduce bullet points, shorten descriptions, or remove optional sections.

## Multi-Language Versions

When the user requests multiple language versions (e.g., German + English):
- Create separate YAML files: `FirstName_LastName_CV.yaml` (primary) and `FirstName_LastName_CV_EN.yaml` (English).
- Translate all content fields (highlights, summaries, section labels) – not just the locale setting.
- Skill and technology names remain in English (industry standard).
- Render them sequentially. RenderCV overwrites the output directory on each run, so:
  - Render the primary version, rename output files with a `_DE` suffix.
  - Render the English version, rename output files with an `_EN` suffix.
- If the user only says "add an English version", keep the existing German version intact and add the English one alongside it.

### 4. Response

Reply concisely with:
- Applicant name and ID
- Role and seniority
- Language(s) generated
- File paths (YAML + PDF)

## Completion Checklist

Before declaring the generation complete, verify:
- [ ] All 11 required CSV fields are present and non-empty.
- [ ] First Name, Last Name, City, Country match exactly between CSV and CV.
- [ ] ID is unique (not reused) and follows `APP-XXXX` format.
- [ ] Last name does not duplicate any existing applicant in `Bewerber.csv`.
- [ ] All addresses and phone numbers are German (German streets/cities, +49 prefix).
- [ ] Email uses a `.de` domain.
- [ ] CV YAML starts with the schema reference line.
- [ ] CV contains 2–4 experience entries with quantified bullet points (3–5 each).
- [ ] CV contains 1–2 education entries.
- [ ] German + English language proficiency is stated somewhere in the CV.
- [ ] Timelines are logically consistent (no unexplained gaps >6 months).
- [ ] RenderCV executed without errors; PDF exists.
- [ ] CV fits exactly one page (verified via single `*_1.png` or by visual inspection of PDF).

## Boundaries

- No real personal data, ever.
- No free-text resumes; always RenderCV YAML.
- No empty required fields.
- No inconsistent data between CSV and CV.
- Do not reuse existing IDs or last names.
- Resumes must fit exactly one page – trim content if needed, never let it overflow.
- Do not output unnecessarily long resumes unless explicitly requested.

## Variation

Every new applicant must differ from existing ones in:
- Names and last names
- Cities and career paths
- Education institutions
- Skill combinations
- Summary texts and bullet points

Before writing, check existing CVs in the same role directory to avoid repetitive patterns.

## Priority

When rules conflict, prioritize:
1. Required applicant fields (CSV completeness)
2. Data consistency (CSV ↔ CV)
3. RenderCV compatibility (valid YAML, single page)
4. Realism (plausible fictional data)
5. Stylistic quality