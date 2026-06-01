import 'server-only';

import { APICallError, NoOutputGeneratedError, Output, generateText, type LanguageModel } from 'ai';

import { LlmError } from '../errors';
import { alignByIndex } from './align';
import { chunk, mapWithConcurrency } from './parallel';
import { SYSTEM_PROMPT } from './prompt';
import { resolveModel, type ModelOverrides } from './registry';
import { analysisEnvelopeSchema, type AnalysisItem } from './schema';

import type { ParagraphAnalysis } from '../types';

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
    const offset = offsets[ci]!;
    const analyzed = await analyzeChunk(model, chunkParas);
    for (let i = 0; i < chunkParas.length; i++) {
      results[offset + i] = analyzed[i];
    }
  });

  return paragraphs.map(
    (_, i) => results[i] ?? { isSlop: false, densityScore: 50, extractedFacts: [] },
  );
}

async function analyzeChunk(
  model: LanguageModel,
  paragraphs: string[],
): Promise<ParagraphAnalysis[]> {
  const userPrompt =
    'Analyze the following numbered paragraphs. Return exactly one result per paragraph, echoing each [n] index.\n\n' +
    paragraphs.map((p, i) => `[${i + 1}] ${p}`).join('\n\n');

  let items: AnalysisItem[];
  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: analysisEnvelopeSchema,
        name: 'ParagraphAnalysisBatch',
        description: 'Per-paragraph information-density analysis for an article.',
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
        'missing_api_key',
        'The provider rejected the API key. Check the key for the selected provider.',
        status,
        { cause: err },
      );
    }
    if (status === 429) {
      return new LlmError(
        'analysis_failed',
        'The provider is rate-limiting requests. Wait a moment and try again.',
        429,
        { cause: err },
      );
    }
    if (typeof status === 'number' && status >= 400 && status < 500) {
      return new LlmError(
        'analysis_failed',
        detail
          ? `The provider rejected the request (HTTP ${status}): ${detail}`
          : `The provider rejected the request (HTTP ${status}). The model id may be invalid or may not support structured output.`,
        status,
        { cause: err },
      );
    }
  }

  const reason = NoOutputGeneratedError.isInstance(err)
    ? 'the model did not return valid structured analysis'
    : 'the language model request failed';
  return new LlmError('analysis_failed', `Analysis failed: ${reason}.`, 502, { cause: err });
}

function extractProviderMessage(err: APICallError): string | undefined {
  const raw = err.responseBody;
  let parsed: unknown;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return truncate(raw.trim());
    }
  } else if (raw && typeof raw === 'object') {
    parsed = raw;
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    const errField = obj.error;
    if (errField && typeof errField === 'object') {
      const msg = (errField as Record<string, unknown>).message;
      if (typeof msg === 'string' && msg.trim()) return truncate(msg.trim());
    }
    if (typeof errField === 'string' && errField.trim()) {
      return truncate(errField.trim());
    }
    if (typeof obj.message === 'string' && obj.message.trim()) {
      return truncate(obj.message.trim());
    }
  }

  return undefined;
}

function truncate(value: string, max = 200): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
