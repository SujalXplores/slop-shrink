<div align="center">

```
                        ╔═══════════════════════════════════════╗
                        ║                                       ║
                        ║     ┌───────────────────────────┐     ║
                        ║     │  ◉                        │     ║
                        ║     │     ╱╲     S L O P        │     ║
                        ║     │    ╱  ╲    S H R I N K    │     ║
                        ║     │   ╱ ◉  ╲                  │     ║
                        ║     │  ╱──────╲                 │     ║
                        ║     │  ╲  ◉   ╱  v0.1.0         │     ║
                        ║     │   ╲    ╱                  │     ║
                        ║     │    ╲  ╱  information-     │     ║
                        ║     │     ╲╱   density scanner  │     ║
                        ║     │     ◉                     │     ║
                        ║     └───────────────────────────┘     ║
                        ║                                       ║
                        ╚═══════════════════════════════════════╝
```

# **SLOPSHRINK**

### `// information-density scanner`

**X-ray any article. Collapse the filler. Spotlight the facts.**

`Read less. Learn more.`

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

<br/>

---

</div>

## `// how it works`

SlopShrink runs every paragraph through a 3-stage diagnostic pipeline:

```
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │                 │       │                 │       │                 │
 │   ◉  S C A N   │──────▶│   ◉  S C O R E │──────▶│  ◉  S H R I N K │
 │                 │       │                 │       │                 │
 │  Fetch URL via  │       │  LLM rates each │       │  X-Ray mode     │
 │  Cheerio or     │       │  paragraph 0–100 │       │  collapses slop │
 │  accept raw txt │       │  flags filler,   │       │  spotlights     │
 │                 │       │  extracts facts  │       │  high-density   │
 │                 │       │                 │       │                 │
 └─────────────────┘       └─────────────────┘       └─────────────────┘
        │                         │                         │
        ▼                         ▼                         ▼
   Clean text              Density scores            Interactive view
   split into              + extracted               with fact callouts
   paragraphs              facts & slop              & collapsible filler
                           classification
```

---

## `// live density readout`

Here's what a scan result looks like — every paragraph scored, classified, and annotated:

```
  ┌─ DENSITY SCAN ───────────────────────────────────────────────────────-─┐
  │                                                                        │
  │  PARA 01  ██████████████████████████████████████████████░░  94  ◉ FACT │
  │           "DeepMind's Gemini 2.0 Flash processes 1M tokens..."         │
  │                                                                        │
  │  PARA 02  █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  12  ▓ SLOP   │
  │           "In today's rapidly evolving landscape of AI..."             │
  │                                                                        │
  │  PARA 03  ██████████████████████████████████████████████░░  91  ◉ FACT │
  │           "Pricing drops to $0.10/1M input tokens, 87% cheaper..."     │
  │                                                                        │
  │  PARA 04  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  09  ▓ SLOP   │
  │           "It's worth noting that this development is particularly..." │
  │                                                                        │
  │  PARA 05  ███████████████████████████████████████████░░░░░  88  ◉ FACT │
  │           "Context window expanded from 128K to 1M tokens..."          │
  │                                                                        │
  │  ════════════════════════════════════════════════════════════════════  │
  │                                                                        │
  │  OVERALL DENSITY   ██████████████████████░░░░░░░░░░  62/100            │
  │  SLOP PARAGRAPHS   2 / 5  (40%)                                        │
  │  FACTS EXTRACTED   4                                                   │
  │  READING TIME SAVED  ~1.2 min                                          │
  │                                                                        │
  └──────────────────────────────────────────────────────────────────────-─┘
```

---

## `// scan diagnostics` — Key Metrics

```
  ╔══════════════════════════╦═══════════════════╦══════════════════════════╗
  ║       METRIC             ║     VALUE         ║       NOTES              ║
  ╠══════════════════════════╬═══════════════════╬══════════════════════════╣
  ║  Density Scale           ║  0 – 100          ║  Per-paragraph scoring   ║
  ║  Max Paragraphs          ║  80               ║  Hard cap per scan       ║
  ║  Min Input Words         ║  50               ║  Threshold enforced      ║
  ║  LLM Providers           ║  5                ║  OpenAI/Anthropic/Google ║
  ║                          ║                   ║  OpenRouter/Ollama       ║
  ║  Reading Speed           ║  230 wpm          ║  For time-saved calc     ║
  ║  Max Output Tokens       ║  8,192            ║  LLM structured output   ║
  ║  LLM Retries             ║  2                ║  Auto-retry on failure   ║
  ║  Fetch Timeout           ║  10 seconds       ║  Per URL request         ║
  ║  Max Page Size           ║  2 MB             ║  Content-length guard    ║
  ║  Max Redirects           ║  5                ║  Following chain         ║
  ║  Context Floor           ║  16,384 tokens    ║  Min for model compat    ║
  ║  Density Weighting       ║  Word-weighted    ║  Not a simple average    ║
  ╚══════════════════════════╩═══════════════════╩══════════════════════════╝
```

---

## `// diagnostic capabilities`

```
  ┌──────────────────────────┐  ┌──────────────────────────-┐
  │  ◉  URL SCANNING         │  │  ◉  RAW TEXT INPUT        │
  │                          │  │                           │
  │  Paste any URL. Cheerio  │  │  Drop in any block of     │
  │  strips nav, ads, cookie │  │  text — articles, docs,   │
  │  banners, scripts, and   │  │  newsletters, transcripts │
  │  extracts clean <p>,     │  │  — and get it scored.     │
  │  <li>, <blockquote>.     │  │                           │
  └──────────────────────────┘  └──────────────────────────-┘

  ┌──────────────────────────┐  ┌──────────────────────────-┐
  │  ◉  X-RAY MODE           │  │  ◉  DENSITY SCORING       │
  │                          │  │                           │
  │  Toggle on: slop         │  │  Every paragraph gets a   │
  │  paragraphs collapse to  │  │  0–100 score. Color-coded │
  │  a single line. Click to │  │  bar on the left edge:    │
  │  reveal. Dense paragraphs│  │  GREEN = signal           │
  │  spotlight extracted     │  │  AMBER = mid-density      │
  │  facts in callout boxes. │  │  RED = slop / filler      │
  └──────────────────────────┘  └──────────────────────────-┘

  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  ◉  BYOK ARCHITECTURE    │  │  ◉  MULTI-PROVIDER       │
  │                          │  │                          │
  │  Bring Your Own Key.     │  │  OpenAI · Anthropic ·    │
  │  Keys live in browser    │  │  Google Gemini ·         │
  │  sessionStorage only.    │  │  OpenRouter · Ollama     │
  │  Never touch the server. │  │  (local).                │
  │  Cleared on tab close.   │  │  Locked best-tier models.│
  └──────────────────────────┘  └──────────────────────────┘

  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  ◉  SSRF PROTECTION      │  │  ◉  ACCESSIBILITY        │
  │                          │  │                          │
  │  Blocks localhost,       │  │  Respects                │
  │  private IPs, IPv6       │  │  prefers-reduced-motion  │
  │  loopback, link-local    │  │  for all animations.     │
  │  addresses. Validates    │  │  Keyboard navigable.     │
  │  content-type is HTML.   │  │  Focus-visible outlines. │
  └──────────────────────────┘  └──────────────────────────┘
```

---

## `// provider support matrix`

```
  ┌──────────────┬─────────────────────────────┬───────┬─────────────────┐
  │  PROVIDER    │  LOCKED MODEL               │  BYOK │  LOCAL OPTION   │
  ├──────────────┼─────────────────────────────┼───────┼─────────────────┤
  │  OpenAI      │  gpt-5.4-mini               │  ✓    │  —              │
  │  Anthropic   │  claude-haiku-4-5           │  ✓    │  —              │
  │  Google      │  gemini-3.5-flash           │  ✓    │  —              │
  │  OpenRouter  │  openai/gpt-5.4-mini         │  ✓    │  —              │
  │  Ollama      │  llama3.3                   │  ✓    │  ✓  localhost   │
  └──────────────┴─────────────────────────────┴───────┴─────────────────┘

  All providers use structured output (JSON) with Zod v4 schema validation.
  Models are locked to each provider's cost-efficient workhorse tier: the
  best balance of capability and price for high-volume structured analysis,
  every one with first-class structured-output support.
```

---

## `// signal pipeline` — Architecture

```
                          ┌──────────────────-───┐
                          │      BROWSER         │
                          │                      │
                          │  ┌────────────────┐  │
                          │  │  Input Console │  │
                          │  │  (URL / Text)  │  │
                          │  └───────┬────────┘  │
                          │          │           │
                          │  ┌───────▼────────┐  │
                          │  │  BYOK Store    │  │
                          │  │  (Zustand +    │  │
                          │  │ sessionStorage)│  │
                          │  └───────┬────────┘  │
                          │          │           │
                          └──────────┼───────────┘
                                      │ POST /api/analyze
                                      │ Headers: x-llm-provider,
                                      │          x-llm-key
                          ┌──────────▼────────-────┐
                          │     API ROUTE          │
                          │                        │
                          │  ┌──────────────────┐  │
                          │  │  Zod Validation  │  │
                          │  │ { url } | {text }│  │
                          │  └────────┬─────────┘  │
                          │           │            │
                          │  ┌────────▼─────────┐  │
                          │  │  SSRF Guard      │  │
                          │  │ assertPublicHost │  │
                          │  └────────┬─────────┘  │
                          │           │            │
                          │  ┌────────▼─────────┐  │
                          │  │  Cheerio Scrape  │  │
                          │  │ HTML → paragraphs│  │
                          │  └────────┬─────────┘  │
                          │           │            │
                          │  ┌────────▼─────────┐  │
                          │  │  LLM Analysis    │  │
                          │  │ generateObject() │  │
                          │  │  Zod schema out  │  │
                          │  └────────┬─────────┘  │
                          │           │            │
                          │  ┌────────▼─────────┐  │
                          │  │  Compute Metrics │  │
                          │  │  density, slop,  │  │
                          │  │  reading time    │  │
                          │  └────────┬─────────┘  │
                          │           │            │
                          └───────────┼────────────┘
                                      │ { id }
                          ┌───────────▼───────────-──┐
                          │     RESULTS PAGE         │
                          │   /scan/[id]             │
                          │                          │
                          │  ┌──────────┐ ┌────────┐ │
                          │  │ X-Ray    │ │Sidebar │ │
                          │  │ Article  │ │Donut   │ │
                          │  │ View     │ │Charts  │ │
                          │  │          │ │Stats   │ │
                          │  └──────────┘ └────────┘ │
                          └──────────────────────────┘
```

---

## `// instrument panel` — Tech Stack

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │   FRAMEWORK      Next.js 16.2.6    App Router + React Compiler      │
  │   UI LIBRARY     React 19.2.4      with babel-plugin-react-compiler │
  │   LANGUAGE       TypeScript 5+      strict mode, bundler resolution │
  │   STYLING        Tailwind CSS v4    PostCSS + radiology dark theme  │
  │   ANIMATION      Motion 12.40       Framer Motion successor         │
  │   STATE          Zustand 5.0        vanilla + persist middleware    │
  │   AI SDK         Vercel AI SDK v6   generateObject() + streaming    │
  │   SCHEMA         Zod v4.4           compile-time type verification  │
  │   SCRAPING       Cheerio 1.2        HTML → clean paragraphs         │
  │   UI PRIMITIVES  @base-ui/react     Dialog, Select, Autocomplete    │
  │   DESIGN SYSTEM  shadcn/ui          base-nova style                 │
  │   ICONS          Lucide React       170+ icon set                   │
  │   FONTS          IBM Plex Sans      + IBM Plex Mono + Spectral      │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## `// sterilization protocol` — Security

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  SSRF GUARD                                                     │
  │                                                                 │
  │  assertPublicHost() blocks:                                     │
  │    ✗  localhost / 127.0.0.1 / ::1                              │
  │    ✗  RFC 1918 private IPs (10.x, 172.16-31.x, 192.168.x)      │
  │    ✗  link-local (169.254.x, fe80::)                           │
  │    ✗  IPv6 ULA/LLA                                             │
  │    ✗  content-type ≠ text/html                                 │
  │    ✗  page size > 2 MB                                         │
  │    ✗  redirects > 5                                            │
  │                                                                 │
  │  BYOK KEY LIFECYCLE                                             │
  │                                                                 │
  │  [Browser Tab]  ──x-llm-key header──▶  [API Route]  ──▶  [LLM]  │
  │                                                                 │
  │  • Keys stored in sessionStorage (cleared on tab close)         │
  │  • Never stored server-side                                     │
  │  • Sent via custom HTTP headers only                            │
  │  • Zero .env files required                                     │
  └─────────────────────────────────────────────────────────────────┘
```

---

## `// boot sequence` — Getting Started

```bash
  # ◉ step 1 — clone the repo
  git clone https://github.com/SujalXplores/slop-shrink.git
  cd slop-shrink

  # ◉ step 2 — install dependencies
  npm install

  # ◉ step 3 — start the scanner
  npm run dev
```

```
  ◉ Ready at http://localhost:3000

  ┌────────────────────────────────────────────────────┐
  │  No .env file needed. No API keys in config.       │
  │  Open the app → click the key icon → enter your    │
  │  API key → paste a URL → scan.                     │
  └────────────────────────────────────────────────────┘
```

---

## `// available commands`

```
  ┌───────────────────┬────────────────────┬───────────────────────────┐
  │  SCRIPT           │  COMMAND           │  PURPOSE                  │
  ├───────────────────┼────────────────────┼───────────────────────────┤
  │  npm run dev      │  next dev          │  Start dev server         │
  │  npm run build    │  next build        │  Production build         │
  │  npm run start    │  next start        │  Serve production build   │
  │  npm run lint     │  eslint            │  Run ESLint               │
  └───────────────────┴────────────────────┴───────────────────────────┘
```

---

## `// file manifest` — Project Layout

```
  slop-shrink/
  │
  ├── app/
  │   ├── layout.tsx              ◉ Root layout, fonts, metadata, dark theme
  │   ├── page.tsx                ◉ Home page — input console + how-it-works
  │   ├── globals.css             ◉ Radiology dark theme, atmosphere effects
  │   ├── icon.tsx                ◉ Dynamic favicon (X-ray crosshair SVG)
  │   ├── apple-icon.tsx          ◉ Apple touch icon
  │   ├── robots.ts               ◉ Crawler rules
  │   ├── sitemap.ts              ◉ Sitemap generation
  │   ├── api/
  │   │   └── analyze/route.ts    ◉ POST: {url} | {text} → analysis → {id}
  │   └── scan/
  │       └── [id]/page.tsx       ◉ Dynamic scan results (Server Component)
  │
  ├── components/
  │   ├── input-hero.tsx          ◉ Main input form (URL/text toggle, word count)
  │   ├── key-modal.tsx           ◉ BYOK API key modal
  │   ├── site-header.tsx         ◉ Sticky header with status indicators
  │   ├── xray-article.tsx        ◉ X-Ray article view (collapse/expand/facts)
  │   ├── xray-sidebar.tsx        ◉ Stats dashboard (donut chart, metrics)
  │   ├── xray-toggle.tsx         ◉ Floating X-Ray mode toggle
  │   ├── providers/              ◉ Zustand store context providers
  │   └── ui/                     ◉ Design-system primitives (shadcn/ui)
  │
  ├── lib/
  │   ├── analyze.ts              ◉ Scan orchestration + derived metrics
  │   ├── scrape.ts               ◉ URL → clean paragraphs (SSRF guard)
  │   ├── llm/
  │   │   ├── index.ts            ◉ analyzeParagraphs() — Vercel AI SDK call
  │   │   ├── schema.ts           ◉ Zod schemas + compile-time type proof
  │   │   └── registry.ts         ◉ Model resolver (provider → LanguageModel)
  │   ├── types.ts                ◉ ParagraphAnalysis, ScanResult types
  │   ├── errors.ts               ◉ AppError, ScrapeError, LlmError classes
  │   ├── providers.ts            ◉ Provider registry (5 providers)
  │   ├── storage.ts              ◉ In-memory scan store (swap for prod)
  │   ├── byok.ts                 ◉ BYOK header encoding/decoding
  │   ├── byok-store.ts           ◉ Zustand store (sessionStorage)
  │   ├── xray-store.ts           ◉ X-Ray view Zustand store
  │   └── utils.ts                ◉ cn(), countWords(), densityTier()
  │
  └── public/                     ◉ Static assets
```

---

<div align="center">

## `// deployment status`

```
  ◉  DEPLOYED ON VERCEL
  ◉  LIVE AT  https://slopshrink.vercel.app
  ◉  SOURCE   https://github.com/SujalXplores/slop-shrink
```

---

```
  ╔═══════════════════════════════════════════════════════════════════╗
  ║                                                                   ║
  ║   Built with ◉ for the hackathon.                                 ║
  ║   No filler. No slop. Just signal.                                ║
  ║                                                                   ║
  ╚═══════════════════════════════════════════════════════════════════╝
```

</div>
