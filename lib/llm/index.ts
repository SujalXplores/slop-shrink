import "server-only";

import { generateObject, NoObjectGeneratedError, APICallError } from "ai";

import type { ParagraphAnalysis } from "../types";
import { LlmError } from "../errors";
import { analysisEnvelopeSchema } from "./schema";
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

- extractedFacts (array of strings): the concrete, verifiable facts, figures,
  dates, named entities, or actionable steps actually stated in the paragraph,
  each as a short standalone string. Include ONLY information present in the
  text, never infer, fabricate, or add outside knowledge. If the paragraph
  has none, return an empty array.

Rules:
- Return exactly one result per input paragraph, in the same order. Do not
  merge, split, skip, or reorder paragraphs.
- isSlop, densityScore, and extractedFacts must agree: a paragraph with real
  extractedFacts should not be slop and should score higher; an empty
  extractedFacts array with only generic language is slop.
- Judge only what is on the page. Do not reward confident tone, fluency, or
  length: polished, grammatical marketing/motivational/AI padding is still slop.`;

const MAX_OUTPUT_TOKENS = 8192;

export async function analyzeParagraphs(
  paragraphs: string[],
  overrides?: ModelOverrides,
): Promise<ParagraphAnalysis[]> {
  if (paragraphs.length === 0) return [];

  const { model } = await resolveModel(overrides);

  const userPrompt =
    "Analyze the following numbered paragraphs. Return exactly one result per paragraph, in order.\n\n" +
    paragraphs.map((p, i) => `[${i + 1}] ${p}`).join("\n\n");

  let results: ParagraphAnalysis[];
  try {
    const { object } = await generateObject({
      model,
      schema: analysisEnvelopeSchema,
      schemaName: "ParagraphAnalysisBatch",
      schemaDescription:
        "Per-paragraph information-density analysis for an article.",
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxRetries: 2,
    });
    results = object.results;
  } catch (err) {
    throw toLlmError(err);
  }

  const expected = paragraphs.length;
  if (results.length !== expected) {
    const drift = Math.abs(results.length - expected);
    const tolerance = Math.max(2, Math.ceil(expected * 0.1));
    if (drift > tolerance) {
      throw new LlmError(
        "length_mismatch",
        `Model returned ${results.length} analyses for ${expected} paragraphs.`,
        502,
      );
    }
    console.warn(
      `[llm] reconciling paragraph-count drift: ${results.length} vs ${expected} (tolerance ${tolerance}).`,
    );
  }

  return paragraphs.map((_, i) => {
    const r = results[i];
    if (!r) {
      return { isSlop: false, densityScore: 50, extractedFacts: [] };
    }
    return {
      isSlop: r.isSlop,
      densityScore: Math.max(0, Math.min(100, Math.round(r.densityScore))),
      extractedFacts: r.extractedFacts,
    };
  });
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

  const reason = NoObjectGeneratedError.isInstance(err)
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
