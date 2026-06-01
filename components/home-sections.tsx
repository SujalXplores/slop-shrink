import Link from 'next/link';
import { Check, MoveUp, Pencil, Scissors } from 'lucide-react';
import { PROVIDER_LIST } from '@/lib/providers';

/* ------------------------------------------------------------------ */
/*  Shared edition header                                              */
/* ------------------------------------------------------------------ */

function EditionHead({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-9 flex items-end justify-between gap-4 border-b-[3px] border-double border-ink pb-3">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-slop">
          {kicker}
        </p>
        <h2 className="mt-1.5 font-display text-3xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-[2.6rem]">
          {title}
        </h2>
      </div>
      {note && (
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:block">
          {note}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1 · The reframe — the editorial manifesto                          */
/* ------------------------------------------------------------------ */

export function Reframe() {
  return (
    <section
      aria-label="The reframe"
      className="border-t-[3px] border-double border-ink py-14 sm:py-20"
    >
      <EditionHead
        kicker="Editorial"
        title="Provenance isn’t quality."
        note="vol. i · no. 1"
      />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="font-sans text-[1.0625rem] leading-[1.8] text-ink-dim sm:columns-2 sm:gap-10 [&>p]:mb-4">
          <p className="[&::first-letter]:float-left [&::first-letter]:mr-2.5 [&::first-letter]:mt-1 [&::first-letter]:font-display [&::first-letter]:text-[3.6rem] [&::first-letter]:font-semibold [&::first-letter]:leading-[0.72] [&::first-letter]:text-slop">
            The internet is flooded with copy that nobody actually checked. Most
            detectors ask the wrong question — <em>“was this written by AI?”</em>{' '}
            — as if a byline could certify a thought.
          </p>
          <p>
            But a human can churn out pure filler, and a model can draft a
            dense, verifiable brief. Authorship is a fact about the writer. It
            tells you nothing about whether a paragraph earns the minute it
            takes to read.
          </p>
          <p>
            So SlopShrink reads for substance instead. It scores every paragraph
            on information density, finds exactly where the quality breaks, and
            surfaces the hard facts a skim would miss — then strikes the padding
            from the page so the signal stands alone.
          </p>
        </div>

        <figure className="glass flex flex-col justify-center gap-4 p-7">
          <span className="font-display text-6xl leading-none text-slop">“</span>
          <blockquote className="-mt-6 font-display text-2xl font-medium italic leading-snug text-ink sm:text-[1.7rem]">
            Not “is this AI?” — but “is this actually useful?”
          </blockquote>
          <figcaption className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            <span className="h-px w-6 bg-slop" />
            the editor’s desk
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  2 · A specimen, marked up — visual demo of the pen                 */
/* ------------------------------------------------------------------ */

export function Specimen() {
  return (
    <section
      aria-label="A marked-up specimen"
      className="border-t-[3px] border-double border-ink py-14 sm:py-20"
    >
      <EditionHead
        kicker="From the proofs"
        title="A specimen, marked up."
        note="before / after the pen"
      />

      <div className="glass scan-sweep relative p-2">
        <div className="relative z-10 space-y-6 border border-dashed border-line-bright bg-void/40 p-5 font-sans sm:p-8">
          {/* CUT paragraph */}
          <div className="relative pl-5">
            <span className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-slop/30">
              <span className="absolute bottom-0 left-0 h-[14%] w-full rounded-full bg-slop" />
            </span>
            <span className="mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-slop-dim">
              <span className="stamp border-current py-[0.1rem] text-[8px]">
                <Scissors className="size-2.5" aria-hidden="true" />
                cut
              </span>
              density · 14
            </span>
            <p className="text-[1.0625rem] leading-[1.75] text-ink-faint line-through decoration-slop/70 decoration-1">
              In today’s fast-paced and ever-evolving digital landscape, it is
              more important than ever to truly understand the power of synergy.
              At the end of the day, leveraging cutting-edge solutions can
              unlock a world of possibilities.
            </p>
          </div>

          {/* KEEP paragraph + margin note */}
          <div className="relative pl-5">
            <span className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-signal/25">
              <span className="absolute bottom-0 left-0 h-[92%] w-full rounded-full bg-signal" />
            </span>
            <span className="mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal-dim">
              <span className="stamp border-current py-[0.1rem] text-[8px]">
                keep
              </span>
              density · 92
            </span>
            <p className="text-[1.0625rem] leading-[1.75] text-ink">
              The global market grew 14% in 2023 to $1.2 trillion, driven
              largely by enterprise adoption across North America and the EU.
            </p>
            <div className="mt-2.5 border-l-2 border-signal bg-signal/[0.06] px-3.5 py-2.5">
              <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal-dim">
                <Check className="size-3" aria-hidden="true" />
                editor’s margin notes
              </p>
              <ul className="space-y-1.5">
                {[
                  'Market grew 14% in 2023.',
                  'Reached $1.2 trillion in size.',
                  'Growth driven by enterprise adoption.',
                ].map((fact) => (
                  <li
                    key={fact}
                    className="flex items-start gap-2 font-sans text-[13px] leading-relaxed text-signal-dim"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        <MoveUp className="size-3" aria-hidden="true" />
        this is exactly what x-ray mode does to a live article
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3 · The accuracy ledger — why the scores hold up                   */
/* ------------------------------------------------------------------ */

const LEDGER = [
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
];

const BANDS = [
  { range: '0–20', tier: 'low', label: 'Pure filler — clichés, hype, throat-clearing.' },
  { range: '21–40', tier: 'low', label: 'Mostly filler with a stray weak detail.' },
  { range: '41–60', tier: 'mid', label: 'Mixed — a real point diluted by padding.' },
  { range: '61–80', tier: 'high', label: 'Mostly substance with some connective filler.' },
  { range: '81–100', tier: 'high', label: 'Dense — almost every sentence carries weight.' },
] as const;

const BAND_DOT = {
  low: 'bg-slop',
  mid: 'bg-warn',
  high: 'bg-signal',
} as const;

export function AccuracyLedger() {
  return (
    <section
      aria-label="The accuracy ledger"
      className="border-t-[3px] border-double border-ink py-14 sm:py-20"
    >
      <EditionHead
        kicker="Standards & practices"
        title="Why the scores hold up."
        note="accuracy is a pipeline, not a prompt"
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <dl className="grid gap-px overflow-hidden rounded-sm border border-line-bright bg-line-bright sm:grid-cols-2">
          {LEDGER.map((row) => (
            <div key={row.term} className="bg-panel p-5">
              <dt className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-ink">
                <span className="font-display text-base not-italic text-slop">
                  §
                </span>
                {row.term}
              </dt>
              <dd className="mt-2 font-sans text-[13px] leading-relaxed text-ink-dim">
                {row.def}
              </dd>
            </div>
          ))}
        </dl>

        <div className="glass h-fit p-6">
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
            the scoring rubric
          </p>
          <ul className="space-y-0">
            {BANDS.map((band, i) => (
              <li
                key={band.range}
                className={`flex items-baseline gap-3 py-3 ${
                  i !== BANDS.length - 1 ? 'border-b border-line-bright' : ''
                }`}
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${BAND_DOT[band.tier]}`}
                />
                <span className="w-16 shrink-0 font-mono text-sm font-bold text-ink">
                  {band.range}
                </span>
                <span className="font-sans text-[13px] leading-snug text-ink-dim">
                  {band.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  4 · By the numbers — diagnostics                                   */
/* ------------------------------------------------------------------ */

const FIGURES = [
  { value: '0–100', label: 'density scale' },
  { value: '80', label: 'paragraphs / scan' },
  { value: '5', label: 'llm providers' },
  { value: '230', label: 'wpm reading base' },
  { value: '12', label: 'paragraphs / batch' },
  { value: '×4', label: 'concurrent passes' },
  { value: '10s', label: 'fetch timeout' },
  { value: '2 MB', label: 'max page size' },
];

export function ByTheNumbers() {
  return (
    <section
      aria-label="By the numbers"
      className="border-t-[3px] border-double border-ink py-14 sm:py-20"
    >
      <EditionHead
        kicker="Dispatches"
        title="By the numbers."
        note="every scan, instrumented"
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-line-bright bg-line-bright sm:grid-cols-4">
        {FIGURES.map((fig) => (
          <div
            key={fig.label}
            className="group bg-panel p-5 transition-colors hover:bg-void sm:p-6"
          >
            <p className="font-display text-3xl font-semibold tracking-tight text-ink transition-colors group-hover:text-slop sm:text-[2.4rem]">
              {fig.value}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
              {fig.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  5 · The wire roster — providers                                    */
/* ------------------------------------------------------------------ */

export function ProviderRoster() {
  return (
    <section
      aria-label="Supported providers"
      className="border-t-[3px] border-double border-ink py-14 sm:py-20"
    >
      <EditionHead
        kicker="The wire"
        title="Bring your own desk."
        note="keys never touch our servers"
      />

      <p className="mb-7 max-w-2xl font-sans text-[14px] leading-relaxed text-ink-dim">
        Pick a provider and supply your own key. It lives in this browser tab’s{' '}
        <span className="font-mono text-[0.92em] text-slop">sessionStorage</span>,
        rides along only as a request header to run your scan, and clears the
        moment you close the tab. Each provider is locked to its best-value
        workhorse model for high-volume structured analysis.
      </p>

      <div className="overflow-hidden rounded-sm border border-line-bright">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink bg-void/50 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
              <th className="px-4 py-3 font-bold">Provider</th>
              <th className="px-4 py-3 font-bold">Locked model</th>
              <th className="px-4 py-3 text-right font-bold">Mode</th>
            </tr>
          </thead>
          <tbody>
            {PROVIDER_LIST.map((p, i) => (
              <tr
                key={p.id}
                className={`bg-panel transition-colors hover:bg-void ${
                  i !== PROVIDER_LIST.length - 1
                    ? 'border-b border-line-bright'
                    : ''
                }`}
              >
                <td className="px-4 py-3 font-sans text-[14px] font-semibold text-ink">
                  {p.label}
                </td>
                <td className="px-4 py-3 font-mono text-[13px] text-ink-dim">
                  {p.lockedModel}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`stamp text-[8px] ${
                      p.usesApiKey ? 'text-signal-dim' : 'text-warn'
                    }`}
                  >
                    {p.usesApiKey ? 'byok' : 'local'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6 · Closing colophon / CTA                                         */
/* ------------------------------------------------------------------ */

export function Colophon() {
  return (
    <section
      aria-label="Get started"
      className="border-t-[3px] border-double border-ink py-16 sm:py-24"
    >
      <div className="glass relative overflow-hidden p-8 text-center sm:p-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[12rem] leading-none text-slop/10 sm:text-[16rem]"
        >
          ¶
        </span>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-slop">
          last edition
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Send it to the desk.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-display text-[1.2rem] italic leading-relaxed text-ink-dim">
          Paste a URL or a block of text and let the editor mark it up. No
          account, no setup file — just your key and a page worth shrinking.
        </p>
        <Link
          href="#top"
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-slop px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-void shadow-print-sm transition-transform hover:-translate-y-px active:translate-y-0 active:shadow-none"
        >
          mark up a page
          <Pencil className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
