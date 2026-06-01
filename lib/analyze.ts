import 'server-only';

import { randomUUID } from 'node:crypto';

import { MAX_PARAGRAPHS, MIN_TOTAL_WORDS } from './constants';
import { AppError } from './errors';
import { analyzeParagraphs } from './llm';
import { computeMetrics } from './metrics';
import { scrapeUrl } from './scrape';
import { countWords } from './utils';

import type { ModelOverrides } from './llm/registry';
import type { ParagraphAnalysis, ScanResult, ScanSource } from './types';

export type AnalyzeInput = { url: string } | { text: string };

function splitParagraphs(text: string): string[] {
  const clean = (parts: string[]) =>
    parts.map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);

  const byBlankLine = clean(text.replace(/\r\n/g, '\n').split(/\n\s*\n+/));
  return byBlankLine.length > 1 ? byBlankLine : clean(text.split(/\n+/));
}

export async function analyze(
  input: AnalyzeInput,
  overrides?: ModelOverrides,
): Promise<ScanResult> {
  let source: ScanSource;
  let paragraphs: string[];

  if ('url' in input) {
    const article = await scrapeUrl(input.url);
    paragraphs = article.paragraphs;
    source = {
      type: 'url',
      value: input.url,
      url: article.url,
      title: article.title,
    };
  } else {
    paragraphs = splitParagraphs(input.text);
    const totalWords = paragraphs.reduce((n, p) => n + countWords(p), 0);
    if (totalWords < MIN_TOTAL_WORDS) {
      throw new AppError('too_short', 'Paste at least a few sentences of text to analyze.', 422);
    }
    source = { type: 'text', value: input.text };
  }

  const bounded = paragraphs.slice(0, MAX_PARAGRAPHS);
  const analysis: ParagraphAnalysis[] = await analyzeParagraphs(bounded, overrides);

  const wordsPerParagraph = bounded.map(countWords);
  const metrics = computeMetrics(wordsPerParagraph, analysis);

  return {
    id: randomUUID(),
    source,
    paragraphs: bounded,
    analysis,
    overallDensity: metrics.overallDensity,
    readingTimeSavedMin: metrics.readingTimeSavedMin,
    wordCount: metrics.wordCount,
    slopWordCount: metrics.slopWordCount,
    createdAt: new Date().toISOString(),
  };
}
