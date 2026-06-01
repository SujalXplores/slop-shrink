import { FIGURES } from '@/lib/home-data';

import { EditionHead } from './edition-head';

export function ByTheNumbers() {
  return (
    <section
      aria-label="By the numbers"
      className="border-ink border-t-[3px] border-double py-14 sm:py-20"
    >
      <EditionHead kicker="Dispatches" title="By the numbers." note="every scan, instrumented" />

      <div className="border-line-bright bg-line-bright grid grid-cols-2 gap-px overflow-hidden rounded-sm border sm:grid-cols-4">
        {FIGURES.map((fig) => (
          <div
            key={fig.label}
            className="group bg-panel hover:bg-void p-5 transition-colors sm:p-6"
          >
            <p className="font-display text-ink group-hover:text-slop text-3xl font-semibold tracking-tight transition-colors sm:text-[2.4rem]">
              {fig.value}
            </p>
            <p className="text-ink-faint mt-1 font-mono text-[10px] tracking-[0.16em] uppercase">
              {fig.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
