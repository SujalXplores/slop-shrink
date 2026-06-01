'use client';

import { cn } from '@/lib/utils';

const SKELETON_BARS = [
  { kind: 'signal', width: '92%' },
  { kind: 'signal', width: '100%' },
  { kind: 'slop', width: '84%' },
  { kind: 'signal', width: '97%' },
  { kind: 'slop', width: '78%' },
] as const;

export function ScanSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3 opacity-40">
      {SKELETON_BARS.map((bar, i) => (
        <div key={i} className="flex gap-3">
          <span
            className={cn(
              'mt-1 h-full w-0.5 shrink-0 rounded-full',
              bar.kind === 'signal' ? 'bg-signal/60' : 'bg-slop/60',
            )}
          />
          <span className="skeleton-pulse bg-panel-2 h-3.5 rounded" style={{ width: bar.width }} />
        </div>
      ))}
    </div>
  );
}
