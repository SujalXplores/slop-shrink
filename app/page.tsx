import {
  AccuracyLedger,
  ByTheNumbers,
  Colophon,
  ProviderRoster,
  Reframe,
  Specimen,
} from '@/components/home';
import { InputHero } from '@/components/input-hero';
import { SiteHeader } from '@/components/site-header';
import { STEPS } from '@/lib/home-data';

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
          className="border-ink border-t-[3px] border-double py-12"
        >
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-ink text-3xl font-semibold tracking-tight">
              The house style
            </h2>
            <span className="text-ink-faint font-mono text-[10px] tracking-[0.2em] uppercase">
              three&nbsp;marks &middot; one&nbsp;pass
            </span>
          </div>

          <div className="border-line-bright bg-line-bright grid gap-px overflow-hidden rounded-sm border sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="animate-rise group bg-panel hover:bg-void relative p-5 transition-colors sm:p-6"
                style={{ '--rise-delay': `${440 + i * 90}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-line-bright group-hover:text-slop/35 absolute top-3 right-4 text-4xl font-light transition-colors"
                >
                  {step.mark}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-slop font-mono text-xs font-bold tracking-[0.2em]">
                    {step.n}
                  </span>
                  <h3 className="text-ink font-mono text-sm font-bold tracking-[0.2em] uppercase">
                    {step.title}
                  </h3>
                </div>
                <p className="text-ink-dim mt-3 max-w-[34ch] font-sans text-[15px] leading-relaxed">
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

      <footer className="border-ink border-t-[3px] border-double">
        <div className="text-ink-faint mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 font-mono text-[10px] tracking-[0.2em] uppercase sm:flex-row">
          <span>slopshrink &middot; the density gazette</span>
          <span className="text-ink-dim">read less. learn more.</span>
        </div>
      </footer>
    </div>
  );
}
