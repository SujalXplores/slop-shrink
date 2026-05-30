"use client";

import { useXRayStore } from "@/components/providers/xray-store-provider";

/**
 * Floating "🩻 X-Ray Mode" switch. Reads/writes the shared X-Ray UI store,
 * driving the collapse/spotlight animations in the viewer (`xray-article.tsx`).
 */
export function XRayToggle() {
  const xrayMode = useXRayStore((s) => s.xrayMode);
  const toggleXray = useXRayStore((s) => s.toggleXray);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={toggleXray}
        aria-pressed={xrayMode}
        title="Toggle X-Ray mode"
        className={`glass group flex items-center gap-3 rounded-full py-2.5 pl-3 pr-4 transition-all duration-300 ${
          xrayMode ? "ring-glow-signal" : ""
        }`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-300 ${
            xrayMode
              ? "bg-signal/15 text-signal text-glow-signal"
              : "bg-panel-2 text-ink-dim"
          }`}
        >
          🩻
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
            x-ray mode
          </span>
          <span
            className={`font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
              xrayMode ? "text-signal" : "text-ink-dim"
            }`}
          >
            {xrayMode ? "engaged" : "standby"}
          </span>
        </span>
        {/* Switch track */}
        <span
          className={`relative ml-1 h-5 w-9 rounded-full border transition-colors duration-300 ${
            xrayMode
              ? "border-signal/50 bg-signal/20"
              : "border-line-bright bg-panel"
          }`}
        >
          <span
            className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
              xrayMode
                ? "left-[1.15rem] bg-signal"
                : "left-0.5 bg-ink-faint"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
