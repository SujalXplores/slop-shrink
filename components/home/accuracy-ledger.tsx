import { BAND_DOT, BANDS, LEDGER } from '@/lib/home-data';
import { cn } from '@/lib/utils';

import { EditionHead } from './edition-head';

import type { DensityTier } from '@/lib/utils';

export function AccuracyLedger() {
  return (
    <section
      aria-label="The accuracy ledger"
      className="border-ink border-t-[3px] border-double py-14 sm:py-20"
    >
      <EditionHead
        kicker="Standards & practices"
        title="Why the scores hold up."
        note="accuracy is a pipeline, not a prompt"
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <dl className="border-line-bright bg-line-bright grid gap-px overflow-hidden rounded-sm border sm:grid-cols-2">
          {LEDGER.map((row) => (
            <div key={row.term} className="bg-panel p-5">
              <dt className="text-ink flex items-center gap-2 font-mono text-xs font-bold tracking-[0.16em] uppercase">
                <span className="font-display text-slop text-base not-italic">§</span>
                {row.term}
              </dt>
              <dd className="text-ink-dim mt-2 font-sans text-[13px] leading-relaxed">{row.def}</dd>
            </div>
          ))}
        </dl>

        <div className="glass h-fit p-6">
          <p className="text-ink-faint mb-4 font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
            the scoring rubric
          </p>
          <ul className="space-y-0">
            {BANDS.map((band, i) => (
              <li
                key={band.range}
                className={`flex items-baseline gap-3 py-3 ${
                  i !== BANDS.length - 1 ? 'border-line-bright border-b' : ''
                }`}
              >
                <span
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                    BAND_DOT[band.tier as DensityTier],
                  )}
                />
                <span className="text-ink w-16 shrink-0 font-mono text-sm font-bold">
                  {band.range}
                </span>
                <span className="text-ink-dim font-sans text-[13px] leading-snug">
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
