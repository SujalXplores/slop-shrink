import { PROVIDER_LIST } from '@/lib/providers';

import { EditionHead } from './edition-head';

export function ProviderRoster() {
  return (
    <section
      aria-label="Supported providers"
      className="border-ink border-t-[3px] border-double py-14 sm:py-20"
    >
      <EditionHead
        kicker="The wire"
        title="Bring your own desk."
        note="keys never touch our servers"
      />

      <p className="text-ink-dim mb-7 max-w-2xl font-sans text-[14px] leading-relaxed">
        Pick a provider and supply your own key. It lives in this browser tab’s{' '}
        <span className="text-slop font-mono text-[0.92em]">sessionStorage</span>, rides along only
        as a request header to run your scan, and clears the moment you close the tab. Each provider
        is locked to its best-value workhorse model for high-volume structured analysis.
      </p>

      <div className="border-line-bright overflow-hidden rounded-sm border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-ink bg-void/50 text-ink-faint border-b-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              <th className="px-4 py-3 font-bold">Provider</th>
              <th className="px-4 py-3 font-bold">Locked model</th>
              <th className="px-4 py-3 text-right font-bold">Mode</th>
            </tr>
          </thead>
          <tbody>
            {PROVIDER_LIST.map((p, i) => (
              <tr
                key={p.id}
                className={`bg-panel hover:bg-void transition-colors ${
                  i !== PROVIDER_LIST.length - 1 ? 'border-line-bright border-b' : ''
                }`}
              >
                <td className="text-ink px-4 py-3 font-sans text-[14px] font-semibold">
                  {p.label}
                </td>
                <td className="text-ink-dim px-4 py-3 font-mono text-[13px]">{p.lockedModel}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`stamp text-[8px] ${p.usesApiKey ? 'text-signal-dim' : 'text-warn'}`}
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
