import { MAX_RETAINED_SCANS } from './constants';
import { STORAGE_KEYS } from './stores/keys';
import { createSessionStore, type PersistedCreator } from './stores/session-store';

import type { ScanResult } from './types';

export interface ScanState {
  scans: Record<string, ScanResult>;
}

export interface ScanActions {
  saveScan: (scan: ScanResult) => void;
}

export type ScanStore = ScanState & ScanActions;

export const defaultScanState: ScanState = { scans: {} };

/**
 * Caps retained scans to {@link MAX_RETAINED_SCANS} so sessionStorage never
 * overflows its ~5 MB budget, evicting the oldest scans (by `createdAt`) first.
 */
function evictOldest(scans: Record<string, ScanResult>): Record<string, ScanResult> {
  const ids = Object.keys(scans);
  if (ids.length <= MAX_RETAINED_SCANS) return scans;

  const sorted = ids.sort(
    (a, b) => new Date(scans[a]!.createdAt).getTime() - new Date(scans[b]!.createdAt).getTime(),
  );
  const next = { ...scans };
  for (const id of sorted.slice(0, ids.length - MAX_RETAINED_SCANS)) {
    delete next[id];
  }
  return next;
}

const creator: PersistedCreator<ScanStore> = (set) => ({
  ...defaultScanState,
  saveScan: (scan) => set((s) => ({ scans: evictOldest({ ...s.scans, [scan.id]: scan }) })),
});

export const createScanStore = () => createSessionStore({ name: STORAGE_KEYS.scans, creator });
