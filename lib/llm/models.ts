import "server-only";

import { LlmError } from "../errors";
import type { ProviderId } from "../providers";
import { resolveApiKey } from "./registry";

/**
 * Provider model-list discovery.
 *
 * `listModels()` calls each provider's own "list models" API and returns a
 * deduped, sorted array of model ids the visitor can pick from in the BYOK
 * modal — so they never have to type (and typo) a model id.
 *
 * SECURITY: this runs server-side only (`server-only`). The key arrives as a
 * per-request BYOK override (or the env fallback, via `resolveApiKey`) and is
 * forwarded straight to the provider — it is never logged, echoed, or stored.
 */

export interface ListModelsCreds {
  /** Visitor's API key (BYOK), or undefined to fall back to the server env. */
  apiKey?: string;
  /** Ollama base URL (keyless local provider). */
  baseURL?: string;
}

/** Provider calls should be quick; cap them so a hung provider can't stall us. */
const TIMEOUT_MS = 10_000;

/**
 * Minimum usable context window (tokens). The scan sends a bounded batch (up to
 * `MAX_PARAGRAPHS` numbered paragraphs + the system prompt) and reserves
 * `MAX_OUTPUT_TOKENS` (8k) for the structured result, so models below this
 * floor truncate the article or the JSON and produce the "no valid structured
 * analysis" failure. We drop them from the picklist when a provider reports the
 * window. Kept conservative so only genuinely tiny (4k/8k) models are excluded.
 */
const MIN_CONTEXT_TOKENS = 16_384;

/** Fetch JSON with a timeout, mapping every failure to a typed `LlmError`. */
async function fetchJson(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
  } catch (err) {
    throw new LlmError(
      "models_failed",
      "Couldn't reach the provider to list models.",
      502,
      { cause: err },
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const rejectedKey = res.status === 401 || res.status === 403;
    throw new LlmError(
      "models_failed",
      rejectedKey
        ? "The provider rejected the API key."
        : `The provider couldn't list models (HTTP ${res.status}).`,
      rejectedKey ? res.status : res.status >= 500 ? 502 : 400,
    );
  }

  try {
    return await res.json();
  } catch (err) {
    throw new LlmError(
      "models_failed",
      "The provider returned an unreadable model list.",
      502,
      { cause: err },
    );
  }
}

/** Dedupe, drop blanks, and sort ids for a stable picklist. */
function clean(ids: Array<string | undefined | null>): string[] {
  return Array.from(
    new Set(ids.filter((id): id is string => typeof id === "string" && id.length > 0)),
  ).sort((a, b) => a.localeCompare(b));
}

function pluck(value: unknown, key: string): unknown {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** A context window at or above the usable floor (and actually reported). */
function hasUsableContext(window: unknown): boolean {
  return typeof window === "number" && window >= MIN_CONTEXT_TOKENS;
}

const listers: Record<ProviderId, (creds: ListModelsCreds) => Promise<string[]>> = {
  // OpenAI: /v1/models returns embeddings/tts/etc. too — narrow to text-gen
  // families when we recognize them, else fall back to the full list.
  openai: async (creds) => {
    const key = resolveApiKey("openai", creds.apiKey);
    const json = await fetchJson("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const ids = asArray(pluck(json, "data")).map((m) => pluck(m, "id") as string);
    const chat = ids.filter((id) => /^(gpt|o\d|chatgpt)/i.test(id ?? ""));
    return clean(chat.length ? chat : ids);
  },

  anthropic: async (creds) => {
    const key = resolveApiKey("anthropic", creds.apiKey);
    const json = await fetchJson("https://api.anthropic.com/v1/models?limit=1000", {
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
    });
    return clean(asArray(pluck(json, "data")).map((m) => pluck(m, "id") as string));
  },

  // Google: pass the key as a header (not the URL) so it never lands in a query
  // string. Keep models that support text generation AND have a usable window
  // (`inputTokenLimit`); Gemini's generateContent models do structured output.
  google: async (creds) => {
    const key = resolveApiKey("google", creds.apiKey);
    const json = await fetchJson(
      "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",
      { headers: { "x-goog-api-key": key } },
    );
    const models = asArray(pluck(json, "models")).filter(
      (m) =>
        asArray(pluck(m, "supportedGenerationMethods")).includes(
          "generateContent",
        ) && hasUsableContext(pluck(m, "inputTokenLimit")),
    );
    return clean(
      models.map((m) => {
        const name = pluck(m, "name");
        return typeof name === "string" ? name.replace(/^models\//, "") : undefined;
      }),
    );
  },

  // OpenRouter's catalog is public; send the key only if present (better limits).
  // It exposes per-model capabilities, so keep only models that support strict
  // structured outputs (what generateObject needs) AND have a usable window —
  // this is what prevents picking a model that can't return valid JSON.
  openrouter: async (creds) => {
    const json = await fetchJson("https://openrouter.ai/api/v1/models", {
      headers: creds.apiKey
        ? { Authorization: `Bearer ${creds.apiKey}` }
        : undefined,
    });
    const capable = asArray(pluck(json, "data")).filter(
      (m) =>
        asArray(pluck(m, "supported_parameters")).includes(
          "structured_outputs",
        ) && hasUsableContext(pluck(m, "context_length")),
    );
    return clean(capable.map((m) => pluck(m, "id") as string));
  },

  // Ollama: the local daemon's /api/tags. The base URL may or may not already
  // carry the `/api` suffix (the SDK's default does), so normalize either form.
  ollama: async (creds) => {
    const raw =
      creds.baseURL?.trim() ||
      process.env.OLLAMA_BASE_URL?.trim() ||
      "http://127.0.0.1:11434";
    const base = raw.replace(/\/+$/, "").replace(/\/api$/, "");
    const json = await fetchJson(`${base}/api/tags`);
    return clean(asArray(pluck(json, "models")).map((m) => pluck(m, "name") as string));
  },
};

/**
 * List the available model ids for a provider, honoring a BYOK key/base URL
 * (with the server env as fallback). Throws a typed `LlmError` on any failure.
 */
export function listModels(
  provider: ProviderId,
  creds: ListModelsCreds,
): Promise<string[]> {
  return listers[provider](creds);
}
