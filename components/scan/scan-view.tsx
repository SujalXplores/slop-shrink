'use client';

import { CornerRightDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useScanStore } from '@/components/providers/scan-store-provider';
import { SiteHeader } from '@/components/site-header';
import { XRayArticle, XRaySidebar, XRayToggle } from '@/components/xray';

import { ScanEmpty } from './scan-empty';
import { ScanSidebarPlaceholder } from './scan-sidebar-placeholder';
import { ScanSkeleton } from './scan-skeleton';

interface ScanViewProps {
  id: string;
}

export function ScanView({ id }: ScanViewProps) {
  const storedScan = useScanStore((s) => s.scans[id]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  const scan = hydrated ? storedScan : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <div className="border-line-bright bg-void/60 border-b backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <Link
            href="/"
            className="text-ink-faint hover:text-slop flex cursor-pointer items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
          >
            new submission
          </Link>
          <span className="text-ink-faint font-mono text-[11px] tracking-[0.18em] uppercase">
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
              <div className="text-ink font-sans">
                <header className="border-ink mb-7 border-b-[3px] border-double pb-6">
                  <div className="text-ink-faint mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="border-line-bright bg-panel text-ink-dim rounded-sm border px-2 py-0.5">
                      {scan.source.type === 'url' ? 'web article' : 'pasted text'}
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
                          className="text-signal-dim hover:text-signal inline-flex cursor-pointer items-center gap-1 truncate transition-colors"
                        >
                          source
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                  {scan.source.title && (
                    <h1 className="font-display text-ink text-3xl leading-[1.1] font-medium tracking-tight sm:text-4xl">
                      {scan.source.title}
                    </h1>
                  )}
                </header>

                <div className="border-line-bright text-ink-faint mb-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-y px-1 py-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                  <span className="text-ink-dim font-bold">markup key</span>
                  <Legend label="keep" dotClass="bg-signal" />
                  <Legend label="trim" dotClass="bg-warn" />
                  <Legend label="cut" dotClass="bg-slop" />
                  <span className="text-ink-faint/80 ml-auto hidden items-center gap-1.5 tracking-[0.04em] normal-case sm:flex">
                    flip x-ray to strike the slop
                    <CornerRightDown className="size-3.5" aria-hidden="true" />
                  </span>
                </div>

                <XRayArticle scan={scan} />
              </div>
            ) : (
              <div className="space-y-6">
                {hydrated ? (
                  <ScanEmpty />
                ) : (
                  <HydrationNotice>
                    <p className="text-ink-dim font-mono text-sm tracking-[0.2em] uppercase">
                      pulling galley…
                    </p>
                    <p className="text-ink-faint mt-2 max-w-sm font-sans text-[15px] leading-relaxed">
                      Restoring your marked-up galley from this session…
                    </p>
                  </HydrationNotice>
                )}
                <ScanSkeleton />
              </div>
            )}
          </article>

          <aside className="hidden lg:col-span-4 lg:block">
            {scan ? <XRaySidebar scan={scan} /> : <ScanSidebarPlaceholder />}
          </aside>
        </div>
      </main>

      <XRayToggle />
    </div>
  );
}

function Legend({ label, dotClass }: { label: string; dotClass: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={dotClass + ' h-2.5 w-1 rounded-full'} />
      {label}
    </span>
  );
}

function HydrationNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center">
      {children}
    </div>
  );
}
