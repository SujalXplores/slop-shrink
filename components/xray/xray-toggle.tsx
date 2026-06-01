'use client';

import { PencilLine } from 'lucide-react';

import { useXRayStore } from '@/components/providers/xray-store-provider';
import { cn } from '@/lib/utils';

export function XRayToggle() {
  const xrayMode = useXRayStore((s) => s.xrayMode);
  const toggleXray = useXRayStore((s) => s.toggleXray);

  return (
    <div className="group fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 sm:bottom-6">
      <div
        role="tooltip"
        id="xray-toggle-tip"
        className="pointer-events-none absolute right-0 bottom-full mb-3 w-64 origin-bottom-right translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
      >
        <div className="glass relative p-3.5">
          <p className="text-slop flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
            <PencilLine className="size-3" aria-hidden="true" />
            x-ray markup
          </p>
          <p className="text-ink-dim mt-1.5 font-sans text-[12.5px] leading-relaxed">
            Strikes the low-density <span className="text-slop font-semibold">slop</span> from the
            page and pins the verified facts in the margin — so you read only the lines that earn
            their ink.
          </p>
          <p className="border-line-bright text-ink-faint mt-2 border-t pt-2 font-mono text-[9px] tracking-[0.16em] uppercase">
            now:{' '}
            <span className={xrayMode ? 'text-slop' : 'text-ink-dim'}>
              {xrayMode ? 'pen down · slop struck' : 'pen up · reading in full'}
            </span>
          </p>
          <span
            aria-hidden="true"
            className="border-line-bright bg-panel absolute right-7 -bottom-1.5 h-3 w-3 rotate-45 border-r border-b"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={toggleXray}
        aria-pressed={xrayMode}
        aria-label="Toggle X-Ray markup mode"
        aria-describedby="xray-toggle-tip"
        className={cn(
          'relative flex cursor-pointer items-center gap-2 rounded-sm border py-2 pr-3 pl-2.5 transition-all duration-300 sm:gap-3 sm:py-2.5 sm:pr-4 sm:pl-3',
          xrayMode
            ? 'border-ink bg-ink text-void shadow-print-slop'
            : 'border-ink bg-panel text-ink shadow-print hover:-translate-y-px',
        )}
      >
        <span
          className={cn(
            'relative flex h-7 w-7 items-center justify-center rounded-sm transition-all duration-300 sm:h-9 sm:w-9',
            xrayMode ? 'bg-slop text-void rotate-[-8deg]' : 'bg-void text-slop',
          )}
        >
          <PencilLine className="size-4 sm:size-5" aria-hidden="true" />
          {xrayMode && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="bg-slop/70 absolute inline-flex h-full w-full animate-ping rounded-full" />
              <span className="bg-slop relative inline-flex h-2.5 w-2.5 rounded-full" />
            </span>
          )}
        </span>

        <span className="hidden flex-col items-start leading-tight sm:flex">
          <span
            className={cn(
              'font-mono text-[9px] tracking-[0.22em] uppercase',
              xrayMode ? 'text-void/60' : 'text-ink-faint',
            )}
          >
            x-ray markup
          </span>
          <span
            className={cn(
              'font-mono text-xs font-bold tracking-[0.16em] uppercase transition-colors',
              xrayMode ? 'text-slop' : 'text-ink',
            )}
          >
            {xrayMode ? 'pen down' : 'pen up'}
          </span>
        </span>

        <span
          className={cn(
            'relative ml-1 hidden h-5 w-9 rounded-full border transition-colors duration-300 sm:inline',
            xrayMode ? 'border-void/30 bg-void/15' : 'border-ink bg-panel-2',
          )}
        >
          <span
            className={cn(
              'absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-300',
              xrayMode ? 'bg-slop left-[1.15rem]' : 'bg-ink left-0.5',
            )}
          />
        </span>
      </button>
    </div>
  );
}
