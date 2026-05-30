import "server-only";

import type { ScanResult } from "./types";

const globalForScans = globalThis as unknown as {
  __slopShrinkScans?: Map<string, ScanResult>;
};

const scans: Map<string, ScanResult> =
  globalForScans.__slopShrinkScans ?? new Map<string, ScanResult>();

if (process.env.NODE_ENV !== "production") {
  globalForScans.__slopShrinkScans = scans;
}

export function saveScan(result: ScanResult): void {
  scans.set(result.id, result);
}

export function getScan(id: string): ScanResult | undefined {
  return scans.get(id);
}
