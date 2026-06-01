import { Check, MoveUp, Scissors } from 'lucide-react';

import { EditionHead } from './edition-head';

const CUT_FACTS = [
  'Market grew 14% in 2023.',
  'Reached $1.2 trillion in size.',
  'Growth driven by enterprise adoption.',
] as const;

export function Specimen() {
  return (
    <section
      aria-label="A marked-up specimen"
      className="border-ink border-t-[3px] border-double py-14 sm:py-20"
    >
      <EditionHead
        kicker="From the proofs"
        title="A specimen, marked up."
        note="before / after the pen"
      />

      <div className="glass scan-sweep relative p-2">
        <div className="border-line-bright bg-void/40 relative z-10 space-y-6 border border-dashed p-5 font-sans sm:p-8">
          <div className="relative pl-5">
            <span className="bg-slop/30 absolute top-0 bottom-0 left-0 w-1 rounded-full">
              <span className="bg-slop absolute bottom-0 left-0 h-[14%] w-full rounded-full" />
            </span>
            <span className="text-slop-dim mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
              <span className="stamp border-current py-[0.1rem] text-[8px]">
                <Scissors className="size-2.5" aria-hidden="true" />
                cut
              </span>
              density · 14
            </span>
            <p className="text-ink-faint decoration-slop/70 text-[1.0625rem] leading-[1.75] line-through decoration-1">
              In today’s fast-paced and ever-evolving digital landscape, it is more important than
              ever to truly understand the power of synergy. At the end of the day, leveraging
              cutting-edge solutions can unlock a world of possibilities.
            </p>
          </div>

          <div className="relative pl-5">
            <span className="bg-signal/25 absolute top-0 bottom-0 left-0 w-1 rounded-full">
              <span className="bg-signal absolute bottom-0 left-0 h-[92%] w-full rounded-full" />
            </span>
            <span className="text-signal-dim mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
              <span className="stamp border-current py-[0.1rem] text-[8px]">keep</span>
              density · 92
            </span>
            <p className="text-ink text-[1.0625rem] leading-[1.75]">
              The global market grew 14% in 2023 to $1.2 trillion, driven largely by enterprise
              adoption across North America and the EU.
            </p>
            <div className="border-signal bg-signal/[0.06] mt-2.5 border-l-2 px-3.5 py-2.5">
              <p className="text-signal-dim mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                <Check className="size-3" aria-hidden="true" />
                editor’s margin notes
              </p>
              <ul className="space-y-1.5">
                {CUT_FACTS.map((fact) => (
                  <li
                    key={fact}
                    className="text-signal-dim flex items-start gap-2 font-sans text-[13px] leading-relaxed"
                  >
                    <span className="bg-signal mt-2 h-1 w-1 shrink-0 rounded-full" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="text-ink-faint mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] tracking-[0.18em] uppercase">
        <MoveUp className="size-3" aria-hidden="true" />
        this is exactly what x-ray mode does to a live article
      </p>
    </section>
  );
}
