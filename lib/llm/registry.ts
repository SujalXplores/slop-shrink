import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

import { LlmError } from "../errors";
import {
  PROVIDER_IDS,
  PROVIDERS,
  isProviderId,
  type ProviderId,
} from "../providers";

/**
 * Provider-agnostic model registry.
 *
 * Two ways to choose a model, in precedence order:
 *   1. Per-request BYOK overrides — `{ provider, model, apiKey, baseURL }` from
 *      the visitor's own key (see `route.ts` / the key modal). These NEVER touch
 *      disk, are never logged, and take priority.
 *   2. Server environment — `LLM_PROVIDER` / `LLM_MODEL` + the matching key,
 *      kept as a fallback so a deployment CAN ship a shared key if it wants to.
 *
 * Every entry returns a Vercel AI SDK `LanguageModel`, so `generateObject` in
 * `index.ts` is identical regardless of which provider is active. The supported
 * provider ids + defaults live in the client-safe `../providers` catalog; this
 * module only adds the (server-only) SDK factories. Ollama is lazily imported so
 * its package never weighs down the default path.
 */

export type { ProviderId } from "../providers";
export { PROVIDER_IDS } from "../providers";

/** Optional per-request credentials/selection. All fields precede the env. */
export interface ModelOverrides {
  /** Untrusted provider id from the request; validated against the registry. */
  provider?: string;
  /** Model id; falls back to the provider default when empty. */
  model?: string;
  /** The visitor's own API key (BYOK). Never persisted, never logged. */
  apiKey?: string;
  /** Ollama base URL (keyless local provider). */
  baseURL?: string;
}

/** Per-request credentials handed to a provider factory; both precede env. */
interface ProviderCreds {
  apiKey?: string;
  baseURL?: string;
}

interface ProviderEntry {
  /**
   * Build a `LanguageModel` for `modelId`. `creds.apiKey` / `creds.baseURL`,
   * when present, take precedence over the provider's env var. May be async so
   * optional providers (Ollama) can be imported on demand.
   */
  createModel: (
    modelId: string,
    creds: ProviderCreds,
  ) => LanguageModel | Promise<LanguageModel>;
}

/**
 * Env var holding each key-based provider's API key. Single source of truth
 * shared by the model factory below AND the model-list fetcher (`models.ts`),
 * so the two never drift. Ollama is keyless and absent here.
 */
export const PROVIDER_ENV_KEY = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
} as const satisfies Partial<Record<ProviderId, string>>;

/**
 * Resolve a usable API key: per-request override first, then the env var.
 * The returned string is trimmed and guaranteed non-empty. The error message
 * deliberately echoes the env var NAME but never the key VALUE.
 */
function resolveKey(
  override: string | undefined,
  envName: string,
  provider: ProviderId,
): string {
  const key = override?.trim() || process.env[envName]?.trim();
  if (!key) {
    throw new LlmError(
      "missing_api_key",
      `No API key available for "${provider}". Add your own key in the app, or set ${envName} on the server.`,
      400,
    );
  }
  return key;
}

/**
 * Resolve a key-based provider's API key (BYOK override before env). Exposed so
 * the model-list fetcher reuses the exact same precedence + missing-key error.
 */
export function resolveApiKey(
  provider: keyof typeof PROVIDER_ENV_KEY,
  override?: string,
): string {
  return resolveKey(override, PROVIDER_ENV_KEY[provider], provider);
}

const registry: Record<ProviderId, ProviderEntry> = {
  openai: {
    createModel: (modelId, creds) =>
      createOpenAI({ apiKey: resolveApiKey("openai", creds.apiKey) })(modelId),
  },
  anthropic: {
    createModel: (modelId, creds) =>
      createAnthropic({ apiKey: resolveApiKey("anthropic", creds.apiKey) })(
        modelId,
      ),
  },
  google: {
    createModel: (modelId, creds) =>
      createGoogleGenerativeAI({
        apiKey: resolveApiKey("google", creds.apiKey),
      })(modelId),
  },
  openrouter: {
    // `structuredOutputs.strict` enforces a strict `response_format.json_schema`
    // (it defaults to true, but we set it explicitly to pin the behavior). The
    // model picklist is already filtered to models that support this.
    createModel: (modelId, creds) =>
      createOpenRouter({ apiKey: resolveApiKey("openrouter", creds.apiKey) })(
        modelId,
        { structuredOutputs: { strict: true } },
      ),
  },
  ollama: {
    // Local models need no API key — just a running Ollama daemon. The base URL
    // can come per-request (BYOK modal) or from OLLAMA_BASE_URL.
    createModel: async (modelId, creds) => {
      const { createOllama } = await import("ollama-ai-provider-v2");
      const baseURL = creds.baseURL?.trim() || process.env.OLLAMA_BASE_URL?.trim();
      return createOllama(baseURL ? { baseURL } : undefined)(modelId);
    },
  },
};

export interface ResolvedModel {
  providerId: ProviderId;
  modelId: string;
  model: LanguageModel;
}

/**
 * Resolve the active provider + model, honoring per-request BYOK overrides
 * before the server environment.
 *
 * @param overrides optional `{ provider, model, apiKey, baseURL }` from the
 *   request. A per-request `provider` is validated against the registry (a bad
 *   one is a 400 client error); the env `LLM_PROVIDER` fallback validation
 *   stays a 500 server-misconfig error.
 * @throws {LlmError} `unknown_provider` (bad id) or `missing_api_key` (no key).
 */
export async function resolveModel(
  overrides?: ModelOverrides,
): Promise<ResolvedModel> {
  const requestedProvider = overrides?.provider?.trim().toLowerCase();

  let providerId: ProviderId;
  let modelId: string;

  if (requestedProvider) {
    // BYOK path: untrusted input → validate, and ignore the env model (it is
    // scoped to the env provider, which may differ from this request's).
    if (!isProviderId(requestedProvider)) {
      throw new LlmError(
        "unknown_provider",
        `Unknown provider "${requestedProvider}". Valid options: ${PROVIDER_IDS.join(", ")}.`,
        400,
      );
    }
    providerId = requestedProvider;
    modelId = overrides?.model?.trim() || PROVIDERS[providerId].defaultModel;
  } else {
    // Env path: a misconfigured server is a 500, not the client's fault.
    const envProvider = process.env.LLM_PROVIDER?.trim().toLowerCase() || "openai";
    if (!isProviderId(envProvider)) {
      throw new LlmError(
        "unknown_provider",
        `Unknown LLM_PROVIDER="${envProvider}". Valid options: ${PROVIDER_IDS.join(", ")}.`,
        500,
      );
    }
    providerId = envProvider;
    modelId =
      overrides?.model?.trim() ||
      process.env.LLM_MODEL?.trim() ||
      PROVIDERS[providerId].defaultModel;
  }

  const model = await registry[providerId].createModel(modelId, {
    apiKey: overrides?.apiKey,
    baseURL: overrides?.baseURL,
  });

  return { providerId, modelId, model };
}
