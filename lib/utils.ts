import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MIN_TOTAL_WORDS, WORDS_PER_MINUTE } from './constants';

export { MIN_TOTAL_WORDS, WORDS_PER_MINUTE };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export type DensityTier = 'high' | 'mid' | 'low';

export function densityTier(score: number): DensityTier {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

export interface TierDistribution {
  high: number;
  mid: number;
  low: number;
  total: number;
}

/** Tallies how many paragraphs land in each density tier (keep / trim / cut). */
export function tierDistribution(scores: number[]): TierDistribution {
  const dist: TierDistribution = { high: 0, mid: 0, low: 0, total: scores.length };
  for (const score of scores) dist[densityTier(score)] += 1;
  return dist;
}

/** Whole-number percentage of `value` against `total`, guarding divide-by-zero. */
export function percent(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

/** Formats minutes saved as seconds under a minute, half-minutes below ten, whole minutes above. */
export function formatReadingTimeSaved(minutes: number): {
  value: string;
  unit: 'sec' | 'min';
} {
  const totalSeconds = Math.max(0, Math.round(minutes * 60));
  if (totalSeconds < 60) {
    return { value: String(totalSeconds), unit: 'sec' };
  }
  const mins = totalSeconds / 60;
  const rounded = mins < 10 ? Math.round(mins * 2) / 2 : Math.round(mins);
  return { value: String(rounded), unit: 'min' };
}
