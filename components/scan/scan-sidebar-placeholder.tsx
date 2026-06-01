'use client';

const PLACEHOLDER_ROWS = [
  { label: 'paragraphs', value: '--' },
  { label: 'marked as cut', value: '--' },
  { label: 'facts extracted', value: '--' },
] as const;

export function ScanSidebarPlaceholder() {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="glass p-6">
        <p className="text-ink-faint font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
          information density
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="relative grid h-24 w-24 place-items-center sm:h-36 sm:w-36">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="color-mix(in oklch, var(--color-ink) 9%, transparent)"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-display text-ink-faint text-3xl font-medium sm:text-4xl">
                --
              </span>
              <span className="text-ink-faint block font-mono text-[9px] tracking-[0.2em] uppercase">
                awaiting
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <p className="text-ink-faint font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
          est. reading time saved
        </p>
        <p className="font-display text-ink-dim mt-2 text-3xl font-medium">
          -- <span className="text-ink-faint text-base">min</span>
        </p>
        <dl className="border-line-bright mt-5 space-y-3 border-t pt-4 font-mono text-xs">
          {PLACEHOLDER_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <dt className="text-ink-faint tracking-[0.14em] uppercase">{row.label}</dt>
              <dd className="text-ink-dim">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
