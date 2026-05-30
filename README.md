# SlopShrink

X-ray any article or block of text for **information density**. SlopShrink scores
every paragraph, collapses the filler ("slop"), and spotlights the verifiable
facts, numbers, and steps worth keeping.

## How it works

1. **Scan** — fetch a URL (parsed with Cheerio) or take raw text, then split it
   into clean paragraphs.
2. **Score** — a language model rates each paragraph's density 0–100, flags slop,
   and extracts the hard facts.
3. **Shrink** — X-Ray mode collapses the slop and spotlights the dense paragraphs.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## LLM configuration

SlopShrink is provider-agnostic (OpenAI, Anthropic, Google, OpenRouter, Ollama).
There are two ways to supply credentials:

- **Bring your own key (BYOK)** — enter a key in the in-app modal. It stays in the
  browser tab (sessionStorage), is sent only to run your scan, and is never stored
  server-side.
- **Server environment** — set a shared key as a fallback (see `.env.example`):

  ```bash
  LLM_PROVIDER=openai        # openai | anthropic | google | openrouter | ollama
  LLM_MODEL=gpt-4o-mini      # optional; defaults per provider
  OPENAI_API_KEY=sk-...
  ```

## Project layout

| Path | Responsibility |
| --- | --- |
| `app/` | App Router pages + API routes (`/api/analyze`, `/api/models`) |
| `lib/analyze.ts` | Scan orchestration and derived metrics |
| `lib/scrape.ts` | URL → clean paragraphs (with an SSRF guard) |
| `lib/llm/` | Provider-agnostic model registry, schema, and analysis call |
| `lib/storage.ts` | Scan persistence (swap the in-memory store for prod) |
| `components/` | UI: input console, X-Ray viewer, BYOK modal, design-system primitives |

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```
