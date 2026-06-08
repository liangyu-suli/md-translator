# MD Translator — Design Spec

**Date:** 2026-06-08  
**Status:** Approved

## Overview

A locally-run Next.js web app that accepts a markdown file path or pasted markdown text, translates each paragraph from English to Chinese using Gemini, and displays the results in a parallel EN-ZH layout with switchable display modes. Translations are cached to disk to avoid redundant API calls.

---

## Architecture

Next.js (App Router) running on `localhost:3000`. Two concerns:

1. **Backend** — API routes handle file I/O, markdown parsing, cache reads/writes, and Gemini API calls.
2. **Frontend** — Single React page: input form at top, streaming paragraph grid below.

Communication uses **Server-Sent Events (SSE)**: the backend fans out paragraph translations in parallel to Gemini and pushes each result to the frontend as it completes.

```
[User] → file path or pasted text
         ↓
[POST /api/translate] → parse markdown → SHA-256 hash content → check cache
         ↓ cache miss
[fan out all paragraphs in parallel to Gemini API]
         ↓ each paragraph completes
[SSE stream → frontend] → render paragraph pair immediately
         ↓ all done
[write full translation to disk cache as JSON]
```

---

## Data & Caching

**Storage:** `./translations/` in project root. One JSON file per unique markdown content, named by SHA-256 hash.

```
translations/
  a3f9c1...hash.json
  b7d2e4...hash.json
```

**Cache file schema:**
```json
{
  "hash": "a3f9c1...",
  "source": "original markdown text",
  "paragraphs": [
    { "en": "original paragraph", "zh": "翻译后的段落" }
  ],
  "createdAt": "2026-06-08T00:00:00.000Z"
}
```

**Paragraph splitting:** Split on double newlines (`\n\n`), filter empty strings. Code fences, headings, and horizontal rules are kept as-is in both EN and ZH columns — no translation attempted.

**Cache hit flow:** Hash content on submit → check `translations/<hash>.json` → if found, stream all paragraphs from disk immediately (zero Gemini calls).

---

## Translation

**Model:** `gemini-3.1-flash-lite`  
**Config:** `GEMINI_API_KEY` in `.env.local`

**Prompt per paragraph:**
> Translate the following English text to Chinese. Preserve all technical terms, code, variable names, and jargon exactly as written. Return only the Chinese translation, no explanation.

**Parallelism:** All paragraphs are fanned out to Gemini concurrently. Results are pushed to the frontend via SSE as each one resolves.

**SSE event protocol:**
```
{ "type": "init",  "count": 12 }                         // first event — total paragraph count
{ "type": "paragraph", "index": 0, "en": "...", "zh": "..." }  // one per paragraph, unordered
{ "type": "done" }                                        // all paragraphs complete
{ "type": "error", "index": 2, "message": "..." }        // per-paragraph failure
```

---

## UI & Display Modes

### Input Section (top)
- Text field for local file path (e.g. `/Users/mac/project/plan.md`)
- "Paste text" toggle — expands a textarea for raw markdown input
- **Translate** button

### Toolbar
Three mode toggle buttons, persisted in React state:

| Mode | Behavior |
|------|----------|
| `Hybrid` | Two columns — EN left, ZH right (default) |
| `EN` | Single column, English only |
| `ZH` | Single column, Chinese only |

Mode switching is instant — CSS/state only, no re-fetch.

### Paragraph Grid
- On submit: show a single spinner until the `init` SSE event arrives with the paragraph count
- On `init`: render N skeleton slots
- As `paragraph` events arrive: replace the matching skeleton with EN+ZH text (by index)
- Cache hit: `init` followed immediately by all `paragraph` events — skeletons flash briefly or not at all

---

## Error Handling

| Error | Behavior |
|-------|----------|
| File not found | Inline error below input field |
| Gemini API failure (single paragraph) | That slot shows a retry button; others continue |
| `GEMINI_API_KEY` not set | Prominent banner on page load with setup instructions |
| Empty or invalid file | Server-side check before any Gemini call; error shown immediately |

---

## Configuration

`.env.local` (not committed):
```
GEMINI_API_KEY=your_key_here
```

`.env.local.example` committed to repo as a setup reference.

---

## Out of Scope

- Authentication or multi-user support
- Cloud deployment
- Translation of languages other than EN→ZH
- Editing translations in the UI
