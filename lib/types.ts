/**
 * Shared domain types for SlopShrink.
 *
 * The `ParagraphAnalysis` shape is the contract returned (per paragraph) by the
 * OpenAI semantic-compression call in `/api/analyze` (built in Phase 2). The
 * `extractedFacts`, `densityScore`, and `isSlop` fields map 1:1 to the model's
 * required JSON output so the frontend can highlight, score, and collapse.
 */

export type SourceType = "url" | "text";

export interface ParagraphAnalysis {
  /** True when the paragraph carries no verifiable facts (collapsible filler). */
  isSlop: boolean;
  /** Information density, 0–100 (higher = denser / more signal). */
  densityScore: number;
  /** Hard facts, numbers, or actionable steps lifted out of the paragraph. */
  extractedFacts: string[];
}

export interface ScanSource {
  type: SourceType;
  /** The original URL or the raw pasted text. */
  value: string;
  /** Resolved article title (URL scans only). */
  title?: string;
  /** Canonical/resolved URL (URL scans only). */
  url?: string;
}

export interface ScanResult {
  id: string;
  source: ScanSource;
  /** Cleaned article paragraphs, index-aligned with `analysis`. */
  paragraphs: string[];
  analysis: ParagraphAnalysis[];
  /** Word-weighted average density across all paragraphs, 0–100. */
  overallDensity: number;
  /** Minutes saved by collapsing slop (slop words ÷ reading speed). */
  readingTimeSavedMin: number;
  /** Total word count of the source. */
  wordCount: number;
  /** Word count contained in paragraphs flagged as slop. */
  slopWordCount: number;
  /** ISO timestamp of when the scan was produced. */
  createdAt: string;
}
