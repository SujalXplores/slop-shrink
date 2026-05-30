import "server-only";

import { randomUUID } from "node:crypto";

import type { ParagraphAnalysis, ScanResult, ScanSource } from "./types";
import { AppError } from "./errors";
import { scrapeUrl } from "./scrape";
import { analyzeParagraphs } from "./llm";
import type { ModelOverrides } from "./llm/registry";
import { countWords, MIN_TOTAL_WORDS } from "./utils";

const WORDS_PER_MINUTE = 230;
const MAX_PARAGRAPHS = 80;

export type AnalyzeInput = { url: string } | { text: string };

function splitParagraphs(text: string): string[] {
  const clean = (parts: string[]) =>
    parts.map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);

  const byBlankLine = clean(text.replace(/\r\n/g, "\n").split(/\n\s*\n+/));
  return byBlankLine.length > 1 ? byBlankLine : clean(text.split(/\n+/));
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
    if (totalWords < MIN_TOTAL_WORDS) {
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

  const wordsPerParagraph = bounded.map(countWords);
  const wordCount = wordsPerParagraph.reduce((n, w) => n + w, 0);

  let weightedDensity = 0;
  let slopWordCount = 0;
  analysis.forEach((a, i) => {
    weightedDensity += a.densityScore * wordsPerParagraph[i];
    if (a.isSlop) slopWordCount += wordsPerParagraph[i];
  });

  return {
    id: randomUUID(),
    source,
    paragraphs: bounded,
    analysis,
    overallDensity: wordCount > 0 ? Math.round(weightedDensity / wordCount) : 0,
    readingTimeSavedMin: Math.round((slopWordCount / WORDS_PER_MINUTE) * 10) / 10,
    wordCount,
    slopWordCount,
    createdAt: new Date().toISOString(),
  };
}
