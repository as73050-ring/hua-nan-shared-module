---
name: system-design-spec
description: 'Generate a comprehensive system design specification document (SD) for web applications. Use when: user asks to write spec doc, system design document, SD doc, specification, or needs a formal document describing system functions/fields/validation for developers or clients. Captures screenshots, describes each page/function by chapter, includes field definitions, validation rules, data mappings, and query specifications.'
---

# System Design Specification Document Generator

## When to Use

- User asks to write a system design specification document
- User needs formal documentation for handoff to engineers
- User needs client-facing deliverable describing system functions
- User says "spec doc", "system design", "SD", "design document", "write a spec"

## Output Format

- Single Markdown file with embedded screenshot references
- Language: Traditional Chinese (document content)
- Screenshots saved alongside the doc in a `screenshots/` subfolder
- Reference: See `README-spec-guide.md` in this folder for the Chinese user guide

## Procedure

### Step 1: Understand the System

Before writing, gather context:
1. Read the project's CLAUDE.md / doc/ files if available
2. Read the main source code to understand all pages, features, validation logic
3. Identify: pages/views, CRUD operations, field definitions, validation rules, data sources

### Step 2: Capture Screenshots

Create a Playwright script to systematically screenshot every view/state:
1. List page (full page)
2. Form page - basic info section (viewport)
3. Form page - full page for each variant/template type
4. Each major section/component individually
5. Parameter/settings pages
6. New/create mode

Save to `{doc_folder}/screenshots/` with numbered naming: `01-xxx.png`, `02-xxx.png`

Script pattern:
```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const dir = '{screenshot_dir}';
  await page.goto('{base_url}');
  await page.waitForTimeout(1500);
  // Capture each view...
  await page.screenshot({ path: `${dir}/01-name.png`, fullPage: true });
  // Navigate to next view...
  await browser.close();
})();
```

### Step 3: Write the Document

Follow this chapter structure strictly:

#### Document Header
```markdown
# {System Name} - System Design Specification

| Item | Content |
|------|---------|
| Document Version | v1.0 |
| Date | {YYYY-MM-DD} |
| System Name | {name} |
| Document Type | System Design Specification (SD) |
```

#### Table of Contents
Number all chapters. Use anchor links.

#### Chapter 1: System Overview
- 1.1 Purpose (one paragraph)
- 1.2 Feature summary table (feature | description | key difference)
- 1.3 System structure (ASCII tree diagram)

#### Chapters 2~N: Functional Chapters (one per page/feature)

Each chapter MUST include these subsections in order:

1. **Screenshot** — `![name](screenshots/xx.png)`
2. **Feature Description** — 2-3 sentences on what this page/section does
3. **Query Conditions** (if applicable) — table: field | condition type | description
4. **Query Results / Display Fields** (if applicable) — table: field name | data field | description
5. **Field Definitions** — table: field name | parameter | type | required | validation | notes
6. **Business Logic / Interlinking** — pseudocode block: trigger → steps → data source
7. **Action Buttons** (if applicable) — table: button | function | notes

#### Validation Chapter
- Trigger timing
- Validation rules table: item | condition | error message | display style
- Validation flow (numbered steps)
- Post-save behavior table: mode | behavior

#### Data Structure Chapter
- JSON structure example (full code block)
- Data source mapping table: file | purpose | fields
- Data loading priority (numbered fallback chain)

#### Appendix A: Screenshot Index
Table: # | file | description

#### Appendix B: Constraints & Known Conditions
Table: item | description

### Step 4: Quality Check

Before delivering, verify ALL items:
- [ ] Every visible field has a row in a field definition table
- [ ] Every validation rule is documented with exact error message text
- [ ] Every conditional show/hide is described
- [ ] Every dropdown's data source is specified
- [ ] Screenshots cover all pages and major states
- [ ] Document can stand alone without needing to reference source code
- [ ] Both user-facing label AND technical parameter name are present in field tables

## Writing Rules

1. **Field tables**: Always include parameter name (code variable), type, required flag, validation rule, notes
2. **Validation**: Describe real-time validation (on input/change) and submit-time validation separately
3. **Data mapping**: Every dropdown/select must note its data source
4. **Logic blocks**: Use pseudocode for business logic (trigger → steps → data source)
5. **Screenshots**: Reference with relative paths `![name](screenshots/xx.png)`
6. **Interlinking**: When fields affect each other, describe the linkage explicitly
7. **No ambiguity**: A developer who has never seen the UI must be able to implement from this doc alone
8. **Tables over prose**: Prefer structured tables over paragraphs
9. **Bilingual labels**: Include both user-facing label AND technical parameter name
