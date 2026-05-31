import "server-only";

import { randomUUID } from "node:crypto";

import type { ParagraphAnalysis, ScanResult, ScanSource } from "./types";
import { AppError } from "./errors";
import { scrapeUrl } from "./scrape";
import { analyzeParagraphs } from "./llm";
import type { ModelOverrides } from "./llm/registry";
import { countWords, MIN_TOTAL_WORDS, WORDS_PER_MINUTE } from "./utils";

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
  let fillerWords = 0;
  analysis.forEach((a, i) => {
    const words = wordsPerParagraph[i];
    weightedDensity += a.densityScore * words;
    fillerWords += words * (1 - a.densityScore / 100);
    if (a.isSlop) slopWordCount += words;
  });

  return {
    id: randomUUID(),
    source,
    paragraphs: bounded,
    analysis,
    overallDensity: wordCount > 0 ? Math.round(weightedDensity / wordCount) : 0,
    readingTimeSavedMin: Math.round((fillerWords / WORDS_PER_MINUTE) * 1000) / 1000,
    wordCount,
    slopWordCount,
    createdAt: new Date().toISOString(),
  };
}
