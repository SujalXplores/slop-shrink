import type { ParagraphAnalysis } from '../types';
import type { AnalysisItem } from './schema';

export function fallbackAnalysis(): ParagraphAnalysis {
  return { isSlop: false, densityScore: 50, extractedFacts: [] };
}

export function alignByIndex(items: AnalysisItem[], expected: number): ParagraphAnalysis[] {
  const byIndex = new Map<number, AnalysisItem>();
  items.forEach((item, i) => {
    const idx = Number.isInteger(item.index) ? item.index - 1 : i;
    if (idx >= 0 && idx < expected && !byIndex.has(idx)) {
      byIndex.set(idx, item);
    }
  });

  if (byIndex.size < expected) {
    console.warn(
      `[llm] chunk returned ${byIndex.size} aligned analyses for ${expected} paragraphs.`,
    );
  }

  return Array.from({ length: expected }, (_, i) => {
    const item = byIndex.get(i);
    return item ? reconcile(item) : fallbackAnalysis();
  });
}

export function reconcile(item: AnalysisItem): ParagraphAnalysis {
  const facts = item.extractedFacts.map((f) => f.trim()).filter(Boolean);
  const score = Math.max(0, Math.min(100, Math.round(item.densityScore)));
  let isSlop = item.isSlop;

  if (facts.length > 0) {
    isSlop = false;
  } else if (score <= 20) {
    isSlop = true;
  }

  return { isSlop, densityScore: score, extractedFacts: facts };
}
