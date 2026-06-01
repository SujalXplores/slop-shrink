'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { XRayToggle } from '@/components/xray-toggle';
import { XRayArticle } from '@/components/xray-article';
import { XRaySidebar } from '@/components/xray-sidebar';
import { useScanStore } from '@/components/providers/scan-store-provider';
import { cn } from '@/lib/utils';

interface ScanViewProps {
  id: string;
}

export function ScanView({ id }: ScanViewProps) {
  const storedScan = useScanStore((s) => s.scans[id]);

  // sessionStorage is client-only; gate on a mount flag so the server render
  // and the first client render agree (no hydration mismatch), then reveal
  // the persisted scan once hydrated.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const scan = hydrated ? storedScan : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <div className="border-b border-line/70 bg-void/50 backdrop-blur-lg">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-signal"
          >
            ← new scan
          </Link>
          <span className="font-mono text-[11px] tracking-[0.18em] text-ink-faint">
            scan&nbsp;
            <span className="text-ink-dim">{id.slice(0, 8)}</span>
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        {scan && (
          <div className="mb-8 lg:hidden">
            <XRaySidebar scan={scan} compact />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {scan ? (
              <div className="font-read text-ink">
                <header className="mb-7 border-b border-line/70 pb-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    <span className="rounded-md bg-panel-2 px-2 py-0.5 text-ink-dim">
                      {scan.source.type === 'url'
                        ? 'web article'
                        : 'pasted text'}
                    </span>
                    <span className="text-line-bright">·</span>
                    <span>{scan.wordCount.toLocaleString()} words</span>
                    {scan.source.url && (
                      <>
                        <span className="text-line-bright">·</span>
                        <a
                          href={scan.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer truncate text-signal-dim transition-colors hover:text-signal"
                        >
                          source ↗
                        </a>
                      </>
                    )}
                  </div>
                  {scan.source.title && (
                    <h1 className="font-read text-2xl font-light leading-snug text-ink sm:text-3xl">
                      {scan.source.title}
                    </h1>
                  )}
                </header>

                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line/70 bg-panel/40 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  <span className="text-ink-dim">density</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-signal" />
                    high
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-warn" />
                    mid
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-slop" />
                    slop
                  </span>
                  <span className="ml-auto hidden text-ink-faint/70 normal-case tracking-[0.04em] sm:inline">
                    toggle x-ray to collapse slop ↘
                  </span>
                </div>

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
                      {hydrated ? 'no scan loaded' : 'loading scan…'}
                    </p>
                    <p className="mt-2 max-w-sm font-read text-[15px] leading-relaxed text-ink-faint">
                      {hydrated
                        ? 'This scan lives in this browser tab and could not be found here. Scans are stored locally, so links from another device or after closing the tab will not resolve. Run a fresh scan to fill it.'
                        : 'Restoring your x-rayed article from this session…'}
                    </p>
                  </div>
                  {hydrated && (
                    <Link
                      href="/"
                      className="cursor-pointer mt-1 inline-flex items-center gap-2 rounded-lg bg-signal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void transition-all hover:brightness-110 hover:ring-glow-signal"
                    >
                      start a scan ▸
                    </Link>
                  )}
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
                        className={cn('mt-1 h-full w-0.5 shrink-0 rounded-full', kind === 'signal' ? 'bg-signal/60' : 'bg-slop/60')}
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

          <aside className="hidden lg:col-span-4 lg:block">
            {scan ? (
              <XRaySidebar scan={scan} />
            ) : (
              <div className="sticky top-20 space-y-4">
                <div className="glass rounded-2xl p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                    information density
                  </p>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="relative grid h-24 w-24 place-items-center sm:h-36 sm:w-36">
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
                        <span className="font-mono text-2xl font-semibold text-ink-faint sm:text-3xl">
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
        </div>
      </main>

      <XRayToggle />
    </div>
  );
}
