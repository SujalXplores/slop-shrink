import "server-only";

import type { ScanResult } from "./types";

/**
 * Scan persistence keyed by id.
 *
 * Dev / single-instance implementation: an in-memory Map pinned to `globalThis`
 * so it survives Turbopack HMR module re-evaluation. This is intentionally the
 * one swappable seam — for a multi-instance production deploy, replace the body
 * of these functions with a shared store (Vercel KV, Upstash Redis, or a DB).
 * The `import "server-only"` guard guarantees this module can never be bundled
 * into client code.
 */

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

export function hasScan(id: string): boolean {
  return scans.has(id);
}
