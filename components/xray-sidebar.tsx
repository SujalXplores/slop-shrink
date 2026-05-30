"use client";

import { motion } from "motion/react";
import type { ScanResult } from "@/lib/types";

const CIRCUMFERENCE = 2 * Math.PI * 52;

function densityStrokeColor(score: number): string {
  if (score >= 70) return "var(--color-signal)";
  if (score >= 40) return "var(--color-warn)";
  return "var(--color-slop)";
}

function densityLabel(score: number): string {
  if (score >= 70) return "high";
  if (score >= 40) return "mid";
  return "low";
}

interface XRaySidebarProps {
  scan: ScanResult;
}

export function XRaySidebar({ scan }: XRaySidebarProps) {
  const slopCount = scan.analysis.filter((a) => a.isSlop).length;
  const totalFacts = scan.analysis.reduce(
    (n, a) => n + a.extractedFacts.length,
    0,
  );

  const offset = CIRCUMFERENCE * (1 - scan.overallDensity / 100);
  const strokeColor = densityStrokeColor(scan.overallDensity);

  return (
    <div className="sticky top-20 space-y-4">
      {/* Density ring */}
      <div className="glass rounded-2xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          information density
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="relative grid h-36 w-36 place-items-center">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--color-line)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute text-center">
              <motion.span
                className="font-mono text-3xl font-semibold"
                style={{ color: strokeColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {scan.overallDensity}
              </motion.span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                {densityLabel(scan.overallDensity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="glass rounded-2xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          est. reading time saved
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold text-ink-dim">
          {scan.readingTimeSavedMin}{" "}
          <span className="text-base text-ink-faint">min</span>
        </p>
        <dl className="mt-5 space-y-3 border-t border-line/70 pt-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              paragraphs
            </dt>
            <dd className="text-ink-dim">{scan.paragraphs.length}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              flagged as slop
            </dt>
            <dd className="text-slop-dim">{slopCount}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              facts extracted
            </dt>
            <dd className="text-signal-dim">{totalFacts}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
