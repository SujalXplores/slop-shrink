'use client';

import { motion } from 'motion/react';
import {
  densityTier,
  formatReadingTimeSaved,
  tierDistribution,
  percent,
  cn,
} from '@/lib/utils';
import type { ScanResult } from '@/lib/types';

const CIRCUMFERENCE = 2 * Math.PI * 52;

const TIER_STROKE = {
  high: 'var(--color-signal)',
  mid: 'var(--color-warn)',
  low: 'var(--color-slop)',
} as const;

const TIER_FILL = {
  high: 'bg-signal',
  mid: 'bg-warn',
  low: 'bg-slop',
} as const;

const TIER_TEXT = {
  high: 'text-signal-dim',
  mid: 'text-warn',
  low: 'text-slop-dim',
} as const;

const TIER_META = [
  { key: 'high', label: 'keep' },
  { key: 'mid', label: 'trim' },
  { key: 'low', label: 'cut' },
] as const;

/** Smoothly scroll a paragraph into view; mini-map → article jump. */
function jumpToParagraph(index: number) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(`p-${index}`);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
}

interface XRaySidebarProps {
  scan: ScanResult;
  compact?: boolean;
}

export function XRaySidebar({ scan, compact }: XRaySidebarProps) {
  const scores = scan.analysis.map((a) => a.densityScore);
  const dist = tierDistribution(scores);
  const slopCount = scan.analysis.filter((a) => a.isSlop).length;
  const totalFacts = scan.analysis.reduce(
    (n, a) => n + a.extractedFacts.length,
    0,
  );

  const tier = densityTier(scan.overallDensity);
  const strokeColor = TIER_STROKE[tier];
  const offset = CIRCUMFERENCE * (1 - scan.overallDensity / 100);
  const timeSaved = formatReadingTimeSaved(scan.readingTimeSavedMin);
  const trimmedPct = percent(scan.slopWordCount, scan.wordCount);

  if (compact) {
    return (
      <div className="glass flex flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative grid h-20 w-20 shrink-0 place-items-center sm:h-24 sm:w-24">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="color-mix(in oklch, var(--color-ink) 9%, transparent)"
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
                className="font-display text-2xl font-medium sm:text-3xl"
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
              <dd className="font-bold text-ink-dim">{scan.paragraphs.length}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>cut</dt>
              <dd className="font-bold text-slop-dim">{slopCount}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>facts</dt>
              <dd className="font-bold text-signal-dim">{totalFacts}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>saved</dt>
              <dd className="font-bold text-ink-dim">
                {timeSaved.value} {timeSaved.unit}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>trimmed</dt>
              <dd className="font-bold text-slop-dim">{trimmedPct}%</dd>
            </div>
          </dl>
        </div>
        <DistributionBar dist={dist} />
      </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-4">
      <div className="glass p-6">
        <p className="mb-4 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          information density
          <span className="stamp text-[8px]" style={{ color: strokeColor }}>
            {tier}
          </span>
        </p>
        <div className="flex items-center justify-center">
          <div className="relative grid h-24 w-24 place-items-center sm:h-36 sm:w-36">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="color-mix(in oklch, var(--color-ink) 9%, transparent)"
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
                className="font-display text-4xl font-medium sm:text-5xl"
                style={{ color: strokeColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {scan.overallDensity}
              </motion.span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-line-bright pt-4">
          <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
            verdict split
          </p>
          <DistributionBar dist={dist} />
          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
            {TIER_META.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-1.5 text-ink-faint">
                  <span className={cn('h-2 w-2 rounded-full', TIER_FILL[key])} />
                  {label}
                </dt>
                <dd className={cn('font-bold tabular-nums', TIER_TEXT[key])}>
                  {dist[key]}
                  <span className="ml-1 text-ink-faint">
                    {percent(dist[key], dist.total)}%
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="glass p-6">
        <p className="mb-3 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          density profile
          <span className="normal-case tracking-normal text-ink-faint/70">
            ¶1–{scores.length}
          </span>
        </p>
        <DensityProfile scores={scores} />
        <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint/80">
          each bar is a paragraph · tap to jump
        </p>
      </div>

      <div className="glass p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
          est. reading time saved
        </p>
        <p className="mt-1 font-display text-4xl font-medium text-ink">
          {timeSaved.value}{' '}
          <span className="text-lg italic text-ink-faint">{timeSaved.unit}</span>
        </p>
        <dl className="mt-5 space-y-2.5 border-t border-line-bright pt-4 font-mono text-xs">
          <div className="flex items-baseline">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              paragraphs
            </dt>
            <span className="leader" aria-hidden="true" />
            <dd className="font-bold text-ink-dim">{scan.paragraphs.length}</dd>
          </div>
          <div className="flex items-baseline">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              marked as cut
            </dt>
            <span className="leader" aria-hidden="true" />
            <dd className="font-bold text-slop-dim">{slopCount}</dd>
          </div>
          <div className="flex items-baseline">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              words trimmed
            </dt>
            <span className="leader" aria-hidden="true" />
            <dd className="font-bold text-slop-dim">
              {scan.slopWordCount.toLocaleString()}
              <span className="ml-1 text-ink-faint">{trimmedPct}%</span>
            </dd>
          </div>
          <div className="flex items-baseline">
            <dt className="uppercase tracking-[0.14em] text-ink-faint">
              facts extracted
            </dt>
            <span className="leader" aria-hidden="true" />
            <dd className="font-bold text-signal-dim">{totalFacts}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stacked keep / trim / cut proportion bar                           */
/* ------------------------------------------------------------------ */

function DistributionBar({
  dist,
}: {
  dist: ReturnType<typeof tierDistribution>;
}) {
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-line-bright"
      role="img"
      aria-label={`${dist.high} kept, ${dist.mid} to trim, ${dist.low} to cut`}
    >
      {TIER_META.map(({ key }) => {
        const pct = percent(dist[key], dist.total);
        if (pct === 0) return null;
        return (
          <motion.span
            key={key}
            className={cn('h-full', TIER_FILL[key])}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-paragraph density mini-map — clickable bars                    */
/* ------------------------------------------------------------------ */

function DensityProfile({ scores }: { scores: number[] }) {
  return (
    <div className="flex h-16 items-end gap-px">
      {scores.map((score, i) => {
        const t = densityTier(score);
        return (
          <button
            key={i}
            type="button"
            onClick={() => jumpToParagraph(i)}
            title={`¶${i + 1} · density ${score}`}
            aria-label={`Jump to paragraph ${i + 1}, density ${score}`}
            className="group/bar flex h-full flex-1 items-end"
          >
            <motion.span
              className={cn(
                'w-full rounded-[1px] opacity-80 transition-opacity group-hover/bar:opacity-100',
                TIER_FILL[t],
              )}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(score, 6)}%` }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.012, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
