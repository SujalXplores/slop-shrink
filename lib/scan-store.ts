import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { ScanResult } from "./types";

export interface ScanState {
  scans: Record<string, ScanResult>;
}

export interface ScanActions {
  saveScan: (scan: ScanResult) => void;
}

export type ScanStore = ScanState & ScanActions;

export const defaultScanState: ScanState = { scans: {} };

// Cap how many scans we retain in sessionStorage so we never blow its ~5 MB
// budget. Oldest scans (by createdAt) are evicted first.
const MAX_SCANS = 20;

function evictOldest(scans: Record<string, ScanResult>): Record<string, ScanResult> {
  const ids = Object.keys(scans);
  if (ids.length <= MAX_SCANS) return scans;

  const sorted = ids.sort(
    (a, b) =>
      new Date(scans[a].createdAt).getTime() -
      new Date(scans[b].createdAt).getTime(),
  );
  const next = { ...scans };
  for (const id of sorted.slice(0, ids.length - MAX_SCANS)) {
    delete next[id];
  }
  return next;
}

export const createScanStore = (init: ScanState = defaultScanState) =>
  createStore<ScanStore>()(
    persist(
      (set) => ({
        ...init,
        saveScan: (scan) =>
          set((s) => ({
            scans: evictOldest({ ...s.scans, [scan.id]: scan }),
          })),
      }),
      {
        name: "slopshrink-scans",
        storage: {
          getItem: (name) => {
            if (typeof sessionStorage === "undefined") return null;
            const raw = sessionStorage.getItem(name);
            return raw ? (JSON.parse(raw) as { state: ScanState }) : null;
          },
          setItem: (name, value) => {
            if (typeof sessionStorage === "undefined") return;
            sessionStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            if (typeof sessionStorage === "undefined") return;
            sessionStorage.removeItem(name);
          },
        },
      },
    ),
  );
