import { z } from 'zod';

import type { ParagraphAnalysis } from '../types';

export const paragraphAnalysisSchema = z.object({
  isSlop: z
    .boolean()
    .describe('True when the paragraph carries no verifiable facts (collapsible filler).'),
  densityScore: z
    .number()
    .int()
    .describe('Information density from 0 to 100 (higher = denser / more signal).'),
  extractedFacts: z
    .array(z.string())
    .describe(
      'Hard facts, numbers, dates, named entities, or actionable steps stated in the paragraph. Empty array if none.',
    ),
});

export const analysisItemSchema = paragraphAnalysisSchema.extend({
  index: z
    .number()
    .int()
    .describe('1-based paragraph index, echoed exactly from the [n] label in the prompt.'),
});

export const analysisEnvelopeSchema = z.object({
  results: z
    .array(analysisItemSchema)
    .describe('One analysis object per input paragraph; echo the [n] index for each.'),
});

export type AnalysisItem = z.infer<typeof analysisItemSchema>;
export type AnalysisEnvelope = z.infer<typeof analysisEnvelopeSchema>;

/** Compile-time assertion that the schema stays structurally in sync with {@link ParagraphAnalysis}. */
type _MatchesDomain =
  z.infer<typeof paragraphAnalysisSchema> extends ParagraphAnalysis
    ? ParagraphAnalysis extends z.infer<typeof paragraphAnalysisSchema>
      ? true
      : never
    : never;
const _typeCheck: _MatchesDomain = true;
void _typeCheck;
