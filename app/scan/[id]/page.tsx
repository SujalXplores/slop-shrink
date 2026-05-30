import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { XRayToggle } from '@/components/xray-toggle';
import { XRayArticle } from '@/components/xray-article';
import { XRaySidebar } from '@/components/xray-sidebar';
import { getScan } from '@/lib/storage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const scan = getScan(id);
  const title = scan?.source.title ?? id.slice(0, 8);
  return {
    title,
    description: scan
      ? `X-ray analysis of "${scan.source.title ?? 'article'}": information density scores, extracted facts, and slop detection.`
      : 'View your X-ray scan results.',
  };
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = getScan(id);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <div className="border-b border-line/70 bg-void/50 backdrop-blur-lg">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-signal"
          >
            ← new scan
          </Link>
          <span className="font-mono text-[11px] tracking-[0.18em] text-ink-faint">
            scan&nbsp;
            <span className="text-ink-dim">{id.slice(0, 8)}</span>
          </span>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 py-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          {scan ? (
            <div className="font-read text-ink">
              {scan.source.title && (
                <h1 className="mb-6 font-read text-2xl font-light leading-snug text-ink">
                  {scan.source.title}
                </h1>
              )}
              <XRayArticle scan={scan} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="panel flex flex-col items-center gap-4 rounded-2xl border-dashed px-6 py-14 text-center">
                <span className="text-3xl" aria-hidden="true">
                  🩻
                </span>
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink-dim">
                    no scan loaded
                  </p>
                  <p className="mt-2 max-w-sm font-read text-[15px] leading-relaxed text-ink-faint">
                    This is where your x-rayed article will appear: facts
                    spotlighted, slop ready to collapse. Run a scan to fill it.
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-1 inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void transition-all hover:brightness-110 hover:ring-glow-signal"
                >
                  start a scan ▸
                </Link>
              </div>

              <div aria-hidden="true" className="space-y-3 opacity-40">
                {[
                  ['signal', '92%'],
                  ['signal', '100%'],
                  ['slop', '84%'],
                  ['signal', '97%'],
                  ['slop', '78%'],
                ].map(([kind, w], i) => (
                  <div key={i} className="flex gap-3">
                    <span
                      className={`mt-1 h-full w-0.5 shrink-0 rounded-full ${
                        kind === 'signal' ? 'bg-signal/60' : 'bg-slop/60'
                      }`}
                    />
                    <span
                      className="skeleton-pulse h-3.5 rounded bg-panel-2"
                      style={{ width: w as string }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="lg:col-span-4">
          {scan ? (
            <XRaySidebar scan={scan} />
          ) : (
            <div className="sticky top-20 space-y-4">
              <div className="glass rounded-2xl p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                  information density
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <div className="relative grid h-36 w-36 place-items-center">
                    <svg
                      viewBox="0 0 120 120"
                      className="h-full w-full -rotate-90"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="var(--color-line)"
                        strokeWidth="8"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-mono text-3xl font-semibold text-ink-faint">
                        --
                      </span>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                        awaiting
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                  est. reading time saved
                </p>
                <p className="mt-2 font-mono text-2xl font-semibold text-ink-dim">
                  -- <span className="text-base text-ink-faint">min</span>
                </p>
                <dl className="mt-5 space-y-3 border-t border-line/70 pt-4 font-mono text-xs">
                  {[
                    ['paragraphs', '--'],
                    ['flagged as slop', '--'],
                    ['facts extracted', '--'],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <dt className="uppercase tracking-[0.14em] text-ink-faint">
                        {label}
                      </dt>
                      <dd className="text-ink-dim">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </aside>
      </main>

      <XRayToggle />
    </div>
  );
}
