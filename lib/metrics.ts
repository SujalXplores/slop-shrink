import { MIN_TOTAL_WORDS, WORDS_PER_MINUTE } from './constants';

import type { ParagraphAnalysis } from './types';

export interface ScanMetrics {
  overallDensity: number;
  readingTimeSavedMin: number;
  wordCount: number;
  slopWordCount: number;
  fillerWordCount: number;
}

export function computeMetrics(
  wordsPerParagraph: number[],
  analysis: ParagraphAnalysis[],
): ScanMetrics {
  const wordCount = wordsPerParagraph.reduce((n, w) => n + w, 0);

  let weightedDensity = 0;
  let slopWordCount = 0;
  let fillerWordCount = 0;

  for (let i = 0; i < analysis.length; i++) {
    const words = wordsPerParagraph[i] ?? 0;
    const a = analysis[i]!;
    weightedDensity += a.densityScore * words;
    fillerWordCount += words * (1 - a.densityScore / 100);
    if (a.isSlop) slopWordCount += words;
  }

  return {
    overallDensity: wordCount > 0 ? Math.round(weightedDensity / wordCount) : 0,
    readingTimeSavedMin:
      wordCount > 0 ? Math.round((fillerWordCount / WORDS_PER_MINUTE) * 1000) / 1000 : 0,
    wordCount,
    slopWordCount,
    fillerWordCount,
  };
}

export function hasMinimumWords(paragraphs: string[], counter: (s: string) => number): boolean {
  const total = paragraphs.reduce((n, p) => n + counter(p), 0);
  return total >= MIN_TOTAL_WORDS;
}
