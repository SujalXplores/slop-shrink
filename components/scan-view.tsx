'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  CornerRightDown,
  Pencil,
  FileWarning,
} from 'lucide-react';
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

      <div className="border-b border-line-bright bg-void/60 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors hover:text-slop"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            new submission
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            galley&nbsp;
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
              <div className="font-sans text-ink">
                <header className="mb-7 border-b-[3px] border-double border-ink pb-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    <span className="rounded-sm border border-line-bright bg-panel px-2 py-0.5 text-ink-dim">
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
                          className="inline-flex cursor-pointer items-center gap-1 truncate text-signal-dim transition-colors hover:text-signal"
                        >
                          source
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                  {scan.source.title && (
                    <h1 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl">
                      {scan.source.title}
                    </h1>
                  )}
                </header>

                <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line-bright px-1 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  <span className="font-bold text-ink-dim">markup key</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-signal" />
                    keep
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-warn" />
                    trim
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-1 rounded-full bg-slop" />
                    cut
                  </span>
                  <span className="ml-auto hidden items-center gap-1.5 normal-case tracking-[0.04em] text-ink-faint/80 sm:flex">
                    flip x-ray to strike the slop
                    <CornerRightDown className="size-3.5" aria-hidden="true" />
                  </span>
                </div>

                <XRayArticle scan={scan} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="glass flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center">
                  <FileWarning
                    className="size-10 text-slop"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink-dim">
                      {hydrated ? 'galley not found' : 'pulling galley…'}
                    </p>
                    <p className="mt-2 max-w-sm font-sans text-[15px] leading-relaxed text-ink-faint">
                      {hydrated
                        ? 'This markup lives in this browser tab and could not be found here. Galleys are stored locally, so links from another device or after closing the tab will not resolve. Run a fresh submission to fill it.'
                        : 'Restoring your marked-up galley from this session…'}
                    </p>
                  </div>
                  {hydrated && (
                    <Link
                      href="/"
                      className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-slop px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-void shadow-print-sm transition-all hover:-translate-y-px"
                    >
                      new submission
                      <Pencil className="size-3.5" aria-hidden="true" />
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
              <div className="sticky top-24 space-y-4">
                <div className="glass p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
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
                          stroke="color-mix(in oklch, var(--color-ink) 9%, transparent)"
                          strokeWidth="8"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="font-display text-3xl font-medium text-ink-faint sm:text-4xl">
                          --
                        </span>
                        <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                          awaiting
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
                    est. reading time saved
                  </p>
                  <p className="mt-2 font-display text-3xl font-medium text-ink-dim">
                    -- <span className="text-base text-ink-faint">min</span>
                  </p>
                  <dl className="mt-5 space-y-3 border-t border-line-bright pt-4 font-mono text-xs">
                    {[
                      ['paragraphs', '--'],
                      ['marked as cut', '--'],
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
