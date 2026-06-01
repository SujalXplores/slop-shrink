'use client';

import Link from 'next/link';

import { KeyModal, openKeyModal } from '@/components/key-modal';
import { useByokStore } from '@/components/providers/byok-store-provider';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const hasKey = useByokStore((s) => !!s.apiKey || !!s.baseURL);

  return (
    <>
      <header className="border-ink bg-void/85 sticky top-0 z-40 border-b-[3px] border-double backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className="font-display text-slop text-2xl leading-none font-black transition-transform duration-300 group-hover:-rotate-6"
            >
              ¶
            </span>
            <span className="font-display text-ink text-xl font-semibold tracking-tight">
              Slop<span className="text-slop italic">shrink</span>
            </span>
            <span className="text-ink-faint hidden font-mono text-[9px] tracking-[0.22em] uppercase sm:inline">
              the&nbsp;density&nbsp;gazette
            </span>
          </Link>

          <div className="text-ink-faint flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase sm:gap-4">
            <button
              type="button"
              onClick={openKeyModal}
              className="border-line-bright bg-panel hover:border-ink hover:text-ink flex cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-1 transition-colors"
              title="Configure API key"
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', hasKey ? 'bg-signal' : 'bg-slop')} />
              <span className={cn(hasKey ? 'text-signal-dim' : 'text-slop-dim')}>
                {hasKey ? 'key set' : 'no key'}
              </span>
            </button>
            <span className="bg-line-bright hidden h-3.5 w-px sm:inline" />
            <a
              href="https://github.com/SujalXplores/slop-shrink"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink flex items-center gap-1.5 rounded-sm px-1.5 py-1 transition-colors"
              title="View source on GitHub"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span className="hidden sm:inline">github</span>
            </a>
          </div>
        </div>
      </header>
      <KeyModal />
    </>
  );
}
