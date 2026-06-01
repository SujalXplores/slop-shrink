'use client';

import { motion } from 'motion/react';

import { TIER_FILL, TIER_ORDER, TIER_STROKE, TIER_TEXT } from '@/lib/tier-styles';
import { cn, densityTier, formatReadingTimeSaved, percent, tierDistribution } from '@/lib/utils';

import type { ScanResult } from '@/lib/types';
import type { TierDistribution } from '@/lib/utils';

const CIRCUMFERENCE = 2 * Math.PI * 52;

interface XRaySidebarProps {
  scan: ScanResult;
  compact?: boolean;
}

function jumpToParagraph(index: number) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(`p-${index}`);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
}

function DistributionBar({ dist }: { dist: TierDistribution }) {
  return (
    <div
      className="bg-line-bright flex h-2 w-full overflow-hidden rounded-full"
      role="img"
      aria-label={`${dist.high} kept, ${dist.mid} to trim, ${dist.low} to cut`}
    >
      {TIER_ORDER.map((key) => {
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

function CompactView({
  scan,
  dist,
  slopCount,
  totalFacts,
  timeSaved,
  trimmedPct,
}: {
  scan: ScanResult;
  dist: TierDistribution;
  slopCount: number;
  totalFacts: number;
  timeSaved: { value: string; unit: 'sec' | 'min' };
  trimmedPct: number;
}) {
  const tier = densityTier(scan.overallDensity);
  const strokeColor = TIER_STROKE[tier];
  const offset = CIRCUMFERENCE * (1 - scan.overallDensity / 100);

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
            <span className="text-ink-faint block font-mono text-[7px] tracking-[0.2em] uppercase sm:text-[8px]">
              {tier}
            </span>
          </div>
        </div>
        <dl className="text-ink-faint flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.14em] uppercase sm:text-xs">
          <div className="flex items-center gap-1.5">
            <dt>paragraphs</dt>
            <dd className="text-ink-dim font-bold">{scan.paragraphs.length}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>cut</dt>
            <dd className="text-slop-dim font-bold">{slopCount}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>facts</dt>
            <dd className="text-signal-dim font-bold">{totalFacts}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>saved</dt>
            <dd className="text-ink-dim font-bold">
              {timeSaved.value} {timeSaved.unit}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>trimmed</dt>
            <dd className="text-slop-dim font-bold">{trimmedPct}%</dd>
          </div>
        </dl>
      </div>
      <DistributionBar dist={dist} />
    </div>
  );
}

function FullView({
  scan,
  scores,
  dist,
  slopCount,
  totalFacts,
  timeSaved,
  trimmedPct,
}: {
  scan: ScanResult;
  scores: number[];
  dist: TierDistribution;
  slopCount: number;
  totalFacts: number;
  timeSaved: { value: string; unit: 'sec' | 'min' };
  trimmedPct: number;
}) {
  const tier = densityTier(scan.overallDensity);
  const strokeColor = TIER_STROKE[tier];
  const offset = CIRCUMFERENCE * (1 - scan.overallDensity / 100);

  return (
    <div className="sticky top-24 space-y-4">
      <div className="glass p-6">
        <p className="text-ink-faint mb-4 flex items-center justify-between font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
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
              <span className="text-ink-faint block font-mono text-[9px] tracking-[0.2em] uppercase">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div className="border-line-bright mt-5 border-t pt-4">
          <p className="text-ink-faint mb-2.5 font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
            verdict split
          </p>
          <DistributionBar dist={dist} />
          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
            {TIER_ORDER.map((key) => (
              <div key={key} className="flex flex-col gap-0.5">
                <dt className="text-ink-faint flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-full', TIER_FILL[key])} />
                  {key === 'high' ? 'keep' : key === 'mid' ? 'trim' : 'cut'}
                </dt>
                <dd className={cn('font-bold tabular-nums', TIER_TEXT[key])}>
                  {dist[key]}
                  <span className="text-ink-faint ml-1">{percent(dist[key], dist.total)}%</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="glass p-6">
        <p className="text-ink-faint mb-3 flex items-center justify-between font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
          density profile
          <span className="text-ink-faint/70 tracking-normal normal-case">¶1–{scores.length}</span>
        </p>
        <DensityProfile scores={scores} />
        <p className="text-ink-faint/80 mt-2.5 font-mono text-[9px] tracking-[0.14em] uppercase">
          each bar is a paragraph · tap to jump
        </p>
      </div>

      <div className="glass p-6">
        <p className="text-ink-faint font-mono text-[10px] font-bold tracking-[0.22em] uppercase">
          est. reading time saved
        </p>
        <p className="font-display text-ink mt-1 text-4xl font-medium">
          {timeSaved.value} <span className="text-ink-faint text-lg italic">{timeSaved.unit}</span>
        </p>
        <dl className="border-line-bright mt-5 space-y-2.5 border-t pt-4 font-mono text-xs">
          {[
            { label: 'paragraphs', value: scan.paragraphs.length, className: 'text-ink-dim' },
            { label: 'marked as cut', value: slopCount, className: 'text-slop-dim' },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline">
              <dt className="text-ink-faint tracking-[0.14em] uppercase">{row.label}</dt>
              <span className="leader" aria-hidden="true" />
              <dd className={cn('font-bold', row.className)}>{row.value}</dd>
            </div>
          ))}
          <div className="flex items-baseline">
            <dt className="text-ink-faint tracking-[0.14em] uppercase">words trimmed</dt>
            <span className="leader" aria-hidden="true" />
            <dd className="text-slop-dim font-bold">
              {scan.slopWordCount.toLocaleString()}
              <span className="text-ink-faint ml-1">{trimmedPct}%</span>
            </dd>
          </div>
          <div className="flex items-baseline">
            <dt className="text-ink-faint tracking-[0.14em] uppercase">facts extracted</dt>
            <span className="leader" aria-hidden="true" />
            <dd className="text-signal-dim font-bold">{totalFacts}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function XRaySidebar({ scan, compact }: XRaySidebarProps) {
  const scores = scan.analysis.map((a) => a.densityScore);
  const dist = tierDistribution(scores);
  const slopCount = scan.analysis.filter((a) => a.isSlop).length;
  const totalFacts = scan.analysis.reduce((n, a) => n + a.extractedFacts.length, 0);
  const timeSaved = formatReadingTimeSaved(scan.readingTimeSavedMin);
  const trimmedPct = percent(scan.slopWordCount, scan.wordCount);

  const props = { scan, scores, dist, slopCount, totalFacts, timeSaved, trimmedPct };

  return compact ? <CompactView {...props} /> : <FullView {...props} />;
}
