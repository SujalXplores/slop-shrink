export type SourceType = "url" | "text";

export interface ParagraphAnalysis {
  isSlop: boolean;
  densityScore: number;
  extractedFacts: string[];
}

export interface ScanSource {
  type: SourceType;
  value: string;
  title?: string;
  url?: string;
}

export interface ScanResult {
  id: string;
  source: ScanSource;
  paragraphs: string[];
  analysis: ParagraphAnalysis[];
  overallDensity: number;
  readingTimeSavedMin: number;
  wordCount: number;
  slopWordCount: number;
  createdAt: string;
}
