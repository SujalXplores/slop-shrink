import type { DensityTier } from './utils';

export const TIER_STROKE: Record<DensityTier, string> = {
  high: 'var(--color-signal)',
  mid: 'var(--color-warn)',
  low: 'var(--color-slop)',
};

export const TIER_FILL: Record<DensityTier, string> = {
  high: 'bg-signal',
  mid: 'bg-warn',
  low: 'bg-slop',
};

export const TIER_TRACK: Record<DensityTier, string> = {
  high: 'bg-signal/25',
  mid: 'bg-warn/25',
  low: 'bg-slop/25',
};

export const TIER_TEXT: Record<DensityTier, string> = {
  high: 'text-signal-dim',
  mid: 'text-warn',
  low: 'text-slop-dim',
};

export const TIER_LABEL: Record<DensityTier, string> = {
  high: 'keep',
  mid: 'trim',
  low: 'cut',
};

export const TIER_ORDER: readonly DensityTier[] = ['high', 'mid', 'low'];
