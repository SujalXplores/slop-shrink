'use client';

import { motion } from 'motion/react';
import { densityTier } from '@/lib/utils';
import type { ScanResult } from '@/lib/types';

const CIRCUMFERENCE = 2 * Math.PI * 52;

const TIER_STROKE = {
  high: 'var(--color-signal)',
  mid: 'var(--color-warn)',
  low: 'var(--color-slop)',
} as const;

interface XRaySidebarProps {
  scan: ScanResult;
  compact?: boolean;
}

export function XRaySidebar({ scan, compact }: XRaySidebarProps) {
  const slopCount = scan.analysis.filter((a) => a.isSlop).length;
  const totalFacts = scan.analysis.reduce(
    (n, a) => n + a.extractedFacts.length,
    0,
  );

  const tier = densityTier(scan.overallDensity);
  const strokeColor = TIER_STROKE[tier];
  const offset = CIRCUMFERENCE * (1 - scan.overallDensity / 100);

  if (compact) {
    return (
      <div className="glass flex items-center gap-4 rounded-2xl px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center sm:h-24 sm:w-24">
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
              className="font-mono text-xl font-semibold sm:text-2xl"
              style={{ color: strokeColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {scan.overallDensity}
            </motion.span>
            <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-ink-faint sm:text-[8px]">
              {tier}
            </span>
          </div>
        </div>
        <dl className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint sm:text-xs">
          <div className="flex items-center gap-1.5">
            <dt>paragraphs</dt>
            <dd className="text-ink-dim">{scan.paragraphs.length}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>slop</dt>
            <dd className="text-slop-dim">{slopCount}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>facts</dt>
            <dd className="text-signal-dim">{totalFacts}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>saved</dt>
            <dd className="text-ink-dim">
              {scan.readingTimeSavedMin} min
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-4">
      <div className="glass rounded-2xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          information density
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="relative grid h-24 w-24 place-items-center sm:h-36 sm:w-36">
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
                className="font-mono text-2xl font-semibold sm:text-3xl"
                style={{ color: strokeColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {scan.overallDensity}
              </motion.span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                {tier}
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
          {scan.readingTimeSavedMin}{' '}
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
