import "server-only";

import {
  generateText,
  Output,
  NoOutputGeneratedError,
  APICallError,
  type LanguageModel,
} from "ai";

import type { ParagraphAnalysis } from "../types";
import { LlmError } from "../errors";
import { analysisEnvelopeSchema, type AnalysisItem } from "./schema";
import { resolveModel, type ModelOverrides } from "./registry";

const SYSTEM_PROMPT = `You are SlopShrink, an information-density analyzer. You are given the
paragraphs of an article or block of text, numbered in order. Analyze EACH
paragraph independently for how much verifiable information it carries versus
filler ("slop").

For each paragraph, return an object with exactly these fields:

- isSlop (boolean): true if the paragraph is filler: it carries no verifiable
  facts, figures, or actionable steps and could be deleted without losing
  information. Hallmarks of slop: clichés and buzzwords ("in today's
  fast-paced world", "leverage synergy", "at the end of the day"), vague
  platitudes, empty hype, throat-clearing, and restated generalities. false if
  the paragraph contains concrete, verifiable substance.

- densityScore (integer 0–100): information density. 0 = pure filler with zero
  signal; 100 = nearly every sentence carries hard, specific, verifiable
  information (numbers, named entities, dates, concrete steps, causal claims).
  Score on the PROPORTION of the paragraph that is signal, not its length. A
  short paragraph with one solid fact scores higher than a long paragraph of
  eloquent padding.

  Calibration bands:
    0–20   pure filler: clichés, hype, throat-clearing, restated generalities.
    21–40  mostly filler with a stray weak detail.
    41–60  mixed: a real point diluted by padding or vague framing.
    61–80  mostly substance: specific claims with some connective filler.
    81–100 dense: almost every sentence carries hard, verifiable information.

  Examples:
    "In today's fast-paced world, businesses must leverage synergy to win." → 5
    "The update improves performance and users will appreciate the changes." → 35
    "The team rewrote the parser, which they say cut load time noticeably." → 60
    "Gemini 2.0 Flash processes 1M tokens at $0.10 per 1M input tokens, 87%
     cheaper than the prior tier, and shipped on December 11, 2024." → 95

- extractedFacts (array of strings): the concrete, verifiable facts, figures,
  dates, named entities, or actionable steps actually stated in the paragraph,
  each as a short standalone string. Include ONLY information present in the
  text, never infer, fabricate, or add outside knowledge. If the paragraph
  has none, return an empty array.

- index (integer): echo back the [n] index shown before the paragraph, exactly.

Rules:
- Return exactly one result per input paragraph, each carrying its [n] index.
  Do not merge, split, skip, or reorder paragraphs.
- isSlop, densityScore, and extractedFacts must agree: a paragraph with real
  extractedFacts should not be slop and should score higher; an empty
  extractedFacts array with only generic language is slop.
- Judge only what is on the page. Do not reward confident tone, fluency, or
  length: polished, grammatical marketing/motivational/AI padding is still slop.`;

const MAX_OUTPUT_TOKENS = 8192;
const CHUNK_SIZE = 12;
const MAX_CONCURRENCY = 4;

export async function analyzeParagraphs(
  paragraphs: string[],
  overrides?: ModelOverrides,
): Promise<ParagraphAnalysis[]> {
  if (paragraphs.length === 0) return [];

  const { model } = await resolveModel(overrides);

  const chunks = chunk(paragraphs, CHUNK_SIZE);
  const offsets: number[] = [];
  let running = 0;
  for (const c of chunks) {
    offsets.push(running);
    running += c.length;
  }

  const results = new Array<ParagraphAnalysis | undefined>(paragraphs.length);

  await mapWithConcurrency(chunks, MAX_CONCURRENCY, async (chunkParas, ci) => {
    const offset = offsets[ci];
    const analyzed = await analyzeChunk(model, chunkParas);
    for (let i = 0; i < chunkParas.length; i++) {
      results[offset + i] = analyzed[i];
    }
  });

  return paragraphs.map((_, i) => results[i] ?? fallbackAnalysis());
}

async function analyzeChunk(
  model: LanguageModel,
  paragraphs: string[],
): Promise<ParagraphAnalysis[]> {
  const userPrompt =
    "Analyze the following numbered paragraphs. Return exactly one result per paragraph, echoing each [n] index.\n\n" +
    paragraphs.map((p, i) => `[${i + 1}] ${p}`).join("\n\n");

  let items: AnalysisItem[];
  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: analysisEnvelopeSchema,
        name: "ParagraphAnalysisBatch",
        description:
          "Per-paragraph information-density analysis for an article.",
      }),
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxRetries: 2,
    });
    items = output.results;
  } catch (err) {
    throw toLlmError(err);
  }

  return alignByIndex(items, paragraphs.length);
}

function alignByIndex(
  items: AnalysisItem[],
  expected: number,
): ParagraphAnalysis[] {
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

function reconcile(item: AnalysisItem): ParagraphAnalysis {
  const facts = item.extractedFacts.map((f) => f.trim()).filter(Boolean);
  let score = Math.max(0, Math.min(100, Math.round(item.densityScore)));
  let isSlop = item.isSlop;

  if (facts.length > 0) {
    isSlop = false;
    score = Math.max(score, 45);
  } else if (score <= 20) {
    isSlop = true;
  }

  return { isSlop, densityScore: score, extractedFacts: facts };
}

function fallbackAnalysis(): ParagraphAnalysis {
  return { isSlop: false, densityScore: 50, extractedFacts: [] };
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

async function mapWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const current = cursor++;
      await worker(items[current], current);
    }
  });
  await Promise.all(runners);
}

function toLlmError(err: unknown): LlmError {
  if (APICallError.isInstance(err)) {
    const status = err.statusCode;
    const detail = extractProviderMessage(err);
    console.error(
      `[llm] provider APICallError status=${status} url=${err.url} body=`,
      err.responseBody,
    );

    if (status === 401 || status === 403) {
      return new LlmError(
        "missing_api_key",
        "The provider rejected the API key. Check the key for the selected provider.",
        status,
        { cause: err },
      );
    }
    if (status === 429) {
      return new LlmError(
        "analysis_failed",
        "The provider is rate-limiting requests. Wait a moment and try again.",
        429,
        { cause: err },
      );
    }
    if (typeof status === "number" && status >= 400 && status < 500) {
      return new LlmError(
        "analysis_failed",
        detail
          ? `The provider rejected the request (HTTP ${status}): ${detail}`
          : `The provider rejected the request (HTTP ${status}). The model id may be invalid or may not support structured output.`,
        status,
        { cause: err },
      );
    }
  }

  const reason = NoOutputGeneratedError.isInstance(err)
    ? "the model did not return valid structured analysis"
    : "the language model request failed";
  return new LlmError("analysis_failed", `Analysis failed: ${reason}.`, 502, {
    cause: err,
  });
}

function extractProviderMessage(err: APICallError): string | undefined {
  const raw = err.responseBody;
  let parsed: unknown;
  if (typeof raw === "string" && raw.trim()) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return truncate(raw.trim());
    }
  } else if (raw && typeof raw === "object") {
    parsed = raw;
  }

  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    const errField = obj.error;
    if (errField && typeof errField === "object") {
      const msg = (errField as Record<string, unknown>).message;
      if (typeof msg === "string" && msg.trim()) return truncate(msg.trim());
    }
    if (typeof errField === "string" && errField.trim()) {
      return truncate(errField.trim());
    }
    if (typeof obj.message === "string" && obj.message.trim()) {
      return truncate(obj.message.trim());
    }
  }

  return undefined;
}

function truncate(value: string, max = 200): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
