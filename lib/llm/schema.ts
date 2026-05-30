import { z } from "zod";

import type { ParagraphAnalysis } from "../types";

/**
 * Zod schema mirroring `ParagraphAnalysis` EXACTLY, kept deliberately portable
 * across every provider's native structured-output mode:
 *
 *  - no `.optional()` / `.nullish()`  — OpenAI strict structured outputs reject
 *    optional properties.
 *  - no `.min()` / `.max()`           — OpenAI strict mode AND Google's
 *    OpenAPI-3.0 subset reject numeric range keywords; the 0–100 range is
 *    documented via `.describe()` and enforced (clamped) in `analyze.ts`.
 *  - no unions / `z.enum`             — Google's OpenAPI subset rejects them.
 *
 * The root is an OBJECT (`{ results: [...] }`) because `generateObject`'s
 * default `output: 'object'` mode requires an object at the root.
 */
export const paragraphAnalysisSchema = z.object({
  isSlop: z
    .boolean()
    .describe(
      "True when the paragraph carries no verifiable facts (collapsible filler).",
    ),
  densityScore: z
    .number()
    .int()
    .describe(
      "Information density from 0 to 100 (higher = denser / more signal).",
    ),
  extractedFacts: z
    .array(z.string())
    .describe(
      "Hard facts, numbers, dates, named entities, or actionable steps stated in the paragraph. Empty array if none.",
    ),
});

export const analysisEnvelopeSchema = z.object({
  results: z
    .array(paragraphAnalysisSchema)
    .describe("One analysis object per input paragraph, in the same order."),
});

export type AnalysisEnvelope = z.infer<typeof analysisEnvelopeSchema>;

// Compile-time guarantee the schema stays 1:1 with the domain type.
type _MatchesDomain = z.infer<typeof paragraphAnalysisSchema> extends ParagraphAnalysis
  ? ParagraphAnalysis extends z.infer<typeof paragraphAnalysisSchema>
    ? true
    : never
  : never;
const _typeCheck: _MatchesDomain = true;
void _typeCheck;
