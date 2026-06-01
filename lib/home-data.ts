export const STEPS = [
  {
    n: '01',
    mark: '§',
    title: 'Scan',
    body: 'Fetch the URL and parse it with Cheerio (or take your raw text), then split it into clean paragraphs.',
  },
  {
    n: '02',
    mark: '¶',
    title: 'Score',
    body: "The editor rates each paragraph's information density and pulls the hard facts, numbers, and steps.",
  },
  {
    n: '03',
    mark: '✎',
    title: 'Shrink',
    body: 'Flip X-Ray mode to strike the slop from the page and spotlight only the lines that earn their ink.',
  },
] as const;

export const LEDGER = [
  {
    term: 'Calibrated rubric',
    def: 'A 0–100 scale with five banded definitions and worked examples, scored on the proportion of signal — not length. Eloquent padding still scores low.',
  },
  {
    term: 'Deterministic',
    def: 'Temperature pinned to zero, so the same paragraph earns the same score every pass. No dice-roll verdicts.',
  },
  {
    term: 'Self-consistency',
    def: 'A reconcile step cross-checks all three signals: real facts force a “keep”; factless generic text is pinned as a cut. The model can’t contradict itself.',
  },
  {
    term: 'Index-locked',
    def: 'Every paragraph is labelled and re-seated by its echoed index, so a verdict can never land on the wrong line.',
  },
  {
    term: 'Zero fabrication',
    def: 'Facts are pulled only from the page in front of it — no outside knowledge, no inference, no invented figures. Nothing there means an empty margin.',
  },
  {
    term: 'Graceful fallback',
    def: 'A dropped paragraph degrades to a neutral score instead of corrupting the whole scan.',
  },
] as const;

export const BANDS = [
  { range: '0–20', tier: 'low', label: 'Pure filler — clichés, hype, throat-clearing.' },
  { range: '21–40', tier: 'low', label: 'Mostly filler with a stray weak detail.' },
  { range: '41–60', tier: 'mid', label: 'Mixed — a real point diluted by padding.' },
  { range: '61–80', tier: 'high', label: 'Mostly substance with some connective filler.' },
  { range: '81–100', tier: 'high', label: 'Dense — almost every sentence carries weight.' },
] as const;

export const BAND_DOT = {
  low: 'bg-slop',
  mid: 'bg-warn',
  high: 'bg-signal',
} as const;

export const FIGURES = [
  { value: '0–100', label: 'density scale' },
  { value: '80', label: 'paragraphs / scan' },
  { value: '5', label: 'llm providers' },
  { value: '230', label: 'wpm reading base' },
  { value: '12', label: 'paragraphs / batch' },
  { value: '×4', label: 'concurrent passes' },
  { value: '10s', label: 'fetch timeout' },
  { value: '2 MB', label: 'max page size' },
] as const;
