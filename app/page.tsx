import { SiteHeader } from '@/components/site-header';
import { InputHero } from '@/components/input-hero';
import {
  Reframe,
  Specimen,
  AccuracyLedger,
  ByTheNumbers,
  ProviderRoster,
  Colophon,
} from '@/components/home-sections';

const STEPS = [
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
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-5">
        <div className="py-14 sm:py-20">
          <InputHero />
        </div>

        <section
          aria-label="How it works"
          className="border-t-[3px] border-double border-ink py-12"
        >
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              The house style
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              three&nbsp;marks &middot; one&nbsp;pass
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-sm border border-line-bright bg-line-bright sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="animate-rise group relative bg-panel p-5 transition-colors hover:bg-void sm:p-6"
                style={
                  { '--rise-delay': `${440 + i * 90}ms` } as React.CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-3 font-display text-4xl font-light text-line-bright transition-colors group-hover:text-slop/35"
                >
                  {step.mark}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold tracking-[0.2em] text-slop">
                    {step.n}
                  </span>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-ink">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-[34ch] font-sans text-[15px] leading-relaxed text-ink-dim">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Reframe />
        <Specimen />
        <AccuracyLedger />
        <ByTheNumbers />
        <ProviderRoster />
        <Colophon />
      </main>

      <footer className="border-t-[3px] border-double border-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:flex-row">
          <span>slopshrink &middot; the density gazette</span>
          <span className="text-ink-dim">read less. learn more.</span>
        </div>
      </footer>
    </div>
  );
}
