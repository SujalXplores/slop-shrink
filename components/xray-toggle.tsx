'use client';

import { useXRayStore } from '@/components/providers/xray-store-provider';

export function XRayToggle() {
  const xrayMode = useXRayStore((s) => s.xrayMode);
  const toggleXray = useXRayStore((s) => s.toggleXray);

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] right-6 z-50 sm:bottom-6">
      <button
        type="button"
        onClick={toggleXray}
        aria-pressed={xrayMode}
        title="Toggle X-Ray mode"
        className={`group flex cursor-pointer items-center gap-2 rounded-full border py-2 pl-2.5 pr-3 backdrop-blur-xl transition-all duration-300 sm:gap-3 sm:py-2.5 sm:pl-3 sm:pr-4 ${
          xrayMode
            ? 'border-signal/50 bg-panel ring-glow-signal'
            : 'border-line-bright bg-panel shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] hover:border-line-bright hover:bg-panel-2'
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-base transition-colors duration-300 sm:h-9 sm:w-9 sm:text-lg ${
            xrayMode
              ? 'bg-signal/15 text-signal text-glow-signal'
              : 'bg-panel-2 text-ink-dim'
          }`}
        >
          🩻
        </span>
        <span className="hidden flex-col items-start leading-tight sm:flex">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
            x-ray mode
          </span>
          <span
            className={`font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              xrayMode ? 'text-signal' : 'text-ink-dim'
            }`}
          >
            {xrayMode ? 'engaged' : 'standby'}
          </span>
        </span>
        <span
          className={`relative ml-1 hidden h-5 w-9 rounded-full border transition-colors duration-300 sm:inline ${
            xrayMode
              ? 'border-signal/50 bg-signal/20'
              : 'border-line-bright bg-panel'
          }`}
        >
          <span
            className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
              xrayMode ? 'left-[1.15rem] bg-signal' : 'left-0.5 bg-ink-faint'
            }`}
          />
        </span>
      </button>
    </div>
  );
}
