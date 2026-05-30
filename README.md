# SlopShrink

X-ray any article or block of text for **information density**. SlopShrink scores
every paragraph, collapses the filler ("slop"), and spotlights the verifiable
facts, numbers, and steps worth keeping.

## How it works

1. **Scan**: fetch a URL (parsed with Cheerio) or take raw text, then split it
   into clean paragraphs.
2. **Score**: a language model rates each paragraph's density 0-100, flags slop,
   and extracts the hard facts.
3. **Shrink**: X-Ray mode collapses the slop and spotlights the dense paragraphs.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## LLM configuration

SlopShrink is provider-agnostic (OpenAI, Anthropic, Google, OpenRouter, Ollama).
Enter your API key in the in-app modal (BYOK). It stays in the browser tab
(sessionStorage), is sent only to run your scan, and is never stored server-side.

## Project layout

| Path | Responsibility |
| --- | --- |
| `app/` | App Router pages, API routes, SEO metadata, icons |
| `app/api/analyze/` | POST endpoint: accepts `{ url }` or `{ text }`, runs analysis |
| `app/api/models/` | GET endpoint: lists available models for a provider |
| `app/icon.tsx` | Dynamic favicon (X-ray symbol) |
| `app/robots.ts` | Crawler rules |
| `app/sitemap.ts` | Sitemap generation |
| `lib/analyze.ts` | Scan orchestration and derived metrics |
| `lib/scrape.ts` | URL to clean paragraphs (with an SSRF guard) |
| `lib/llm/` | Provider-agnostic model registry, schema, and analysis call |
| `lib/storage.ts` | Scan persistence (swap the in-memory store for prod) |
| `lib/types.ts` | `ParagraphAnalysis`, `ScanResult` types |
| `lib/errors.ts` | `AppError`, `ScrapeError`, `LlmError` classes |
| `lib/providers.ts` | Provider ID validation |
| `lib/byok.ts` | BYOK header parsing |
| `lib/byok-store.ts` | BYOK zustand store |
| `lib/xray-store.ts` | X-Ray view zustand store |
| `lib/utils.ts` | `countWords`, `MIN_TOTAL_WORDS`, etc. |
| `components/` | UI: input console, X-Ray viewer, BYOK modal |
| `components/ui/` | Design-system primitives (dialog, button, input, select, etc.) |
| `components/providers/` | Zustand store providers for client components |

## Tech stack

- **Next.js 16** (App Router)
- **React 19** with React Compiler
- **Tailwind CSS v4**
- **Vercel AI SDK v6**
- **Zustand** for client state
- **Zod v4** for schema validation

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```
