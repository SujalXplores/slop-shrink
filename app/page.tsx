import { SiteHeader } from '@/components/site-header';
import { InputHero } from '@/components/input-hero';

const STEPS = [
  {
    n: '01',
    title: 'Scan',
    body: 'Fetch the URL and parse it with Cheerio (or take your raw text), then split it into clean paragraphs.',
  },
  {
    n: '02',
    title: 'Score',
    body: "The AI model rates each paragraph's information density and extracts the hard facts, numbers, and steps.",
  },
  {
    n: '03',
    title: 'Shrink',
    body: 'Flip X-Ray mode to collapse the slop to nothing and spotlight only the paragraphs that earn their space.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5">
        <div className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)]">
          <InputHero />
        </div>

        <section
          aria-label="How it works"
          className="grid gap-4 border-t border-line/70 py-12 sm:grid-cols-3"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="animate-rise panel rounded-xl p-3 sm:p-5"
              style={
                { '--rise-delay': `${440 + i * 90}ms` } as React.CSSProperties
              }
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs tracking-[0.2em] text-signal-dim">
                  {step.n}
                </span>
                <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-ink">
                  {step.title}
                </h2>
              </div>
              <p className="mt-3 font-read text-[15px] leading-relaxed text-ink-dim">
                {step.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint sm:flex-row">
          <span>slopshrink · density engine</span>
          <span>read less. learn more.</span>
        </div>
      </footer>
    </div>
  );
}
