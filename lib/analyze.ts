import "server-only";

import { randomUUID } from "node:crypto";

import type { ParagraphAnalysis, ScanResult, ScanSource } from "./types";
import { AppError } from "./errors";
import { scrapeUrl } from "./scrape";
import { analyzeParagraphs } from "./llm";
import type { ModelOverrides } from "./llm/registry";

/**
 * Orchestrates a scan: resolve paragraphs (scrape a URL or split raw text),
 * run the provider-agnostic analysis, compute the derived metrics, and assemble
 * a `ScanResult`.
 */

/** Average adult reading speed; used to convert slop words → minutes saved. */
const WORDS_PER_MINUTE = 230;
const MIN_TOTAL_WORDS = 50;
/** Upper bound on paragraphs per scan, sized to fit the model output budget. */
const MAX_PARAGRAPHS = 80;

export type AnalyzeInput = { url: string } | { text: string };

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Split pasted text into clean paragraphs on blank lines (then single lines). */
function splitParagraphs(text: string): string[] {
  const byBlankLine = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  // Fall back to single-line splitting if the text has no blank-line breaks.
  const candidates =
    byBlankLine.length > 1
      ? byBlankLine
      : text
          .split(/\n+/)
          .map((p) => p.replace(/\s+/g, " ").trim())
          .filter(Boolean);

  return candidates.filter((p) => countWords(p) >= 1);
}

export async function analyze(
  input: AnalyzeInput,
  overrides?: ModelOverrides,
): Promise<ScanResult> {
  let source: ScanSource;
  let paragraphs: string[];

  if ("url" in input) {
    const article = await scrapeUrl(input.url);
    paragraphs = article.paragraphs;
    source = {
      type: "url",
      value: input.url,
      url: article.url,
      title: article.title,
    };
  } else {
    paragraphs = splitParagraphs(input.text);
    const totalWords = paragraphs.reduce((n, p) => n + countWords(p), 0);
    if (paragraphs.length === 0 || totalWords < MIN_TOTAL_WORDS) {
      throw new AppError(
        "too_short",
        "Paste at least a few sentences of text to analyze.",
        422,
      );
    }
    source = { type: "text", value: input.text };
  }

  const bounded = paragraphs.slice(0, MAX_PARAGRAPHS);
  const analysis: ParagraphAnalysis[] = await analyzeParagraphs(bounded, overrides);

  // Word-weighted metrics: long paragraphs count proportionally more.
  const wordsPerParagraph = bounded.map(countWords);
  const wordCount = wordsPerParagraph.reduce((n, w) => n + w, 0);

  let weightedDensity = 0;
  let slopWordCount = 0;
  analysis.forEach((a, i) => {
    const w = wordsPerParagraph[i];
    weightedDensity += a.densityScore * w;
    if (a.isSlop) slopWordCount += w;
  });

  const overallDensity =
    wordCount > 0 ? Math.round(weightedDensity / wordCount) : 0;
  const readingTimeSavedMin =
    Math.round((slopWordCount / WORDS_PER_MINUTE) * 10) / 10;

  return {
    id: randomUUID(),
    source,
    paragraphs: bounded,
    analysis,
    overallDensity,
    readingTimeSavedMin,
    wordCount,
    slopWordCount,
    createdAt: new Date().toISOString(),
  };
}
