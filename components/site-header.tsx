'use client';

import Link from 'next/link';
import { useByokStore } from '@/components/providers/byok-store-provider';
import { KeyModal, openKeyModal } from '@/components/key-modal';

export function SiteHeader() {
  const hasKey = useByokStore((s) => !!s.apiKey || !!s.baseURL);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-void/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="group flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform duration-300 group-hover:rotate-6"
            >
              🩻
            </span>
            <span className="font-mono text-sm font-semibold tracking-[0.18em] text-ink">
              SLOP<span className="text-signal text-glow-signal">SHRINK</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            <span className="hidden sm:inline">density&nbsp;engine</span>
            <span className="hidden h-3 w-px bg-line sm:inline" />
            <button
              type="button"
              onClick={openKeyModal}
              className="cursor-pointer flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-panel-2"
              title="Configure API key"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasKey ? 'bg-signal' : 'bg-slop'
                }`}
              />
              <span className={hasKey ? 'text-signal-dim' : 'text-slop-dim'}>
                {hasKey ? 'key set' : 'no key'}
              </span>
            </button>
            <span className="hidden h-3 w-px bg-line sm:inline" />
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="status-pulse block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              <span className="text-signal-dim">online</span>
            </span>
          </div>
        </div>
      </header>
      <KeyModal />
    </>
  );
}
