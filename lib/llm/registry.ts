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

export type { ProviderId } from "../providers";
export { PROVIDER_IDS } from "../providers";

export interface ModelOverrides {
  provider?: string;
  model?: string;
  apiKey?: string;
  baseURL?: string;
}

interface ProviderCreds {
  apiKey?: string;
  baseURL?: string;
}

interface ProviderEntry {
  createModel: (
    modelId: string,
    creds: ProviderCreds,
  ) => LanguageModel | Promise<LanguageModel>;
}

export const PROVIDER_ENV_KEY = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_GENERATIVE_AI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
} as const satisfies Partial<Record<ProviderId, string>>;

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
    createModel: (modelId, creds) =>
      createOpenRouter({ apiKey: resolveApiKey("openrouter", creds.apiKey) })(
        modelId,
        { structuredOutputs: { strict: true } },
      ),
  },
  ollama: {
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

export async function resolveModel(
  overrides?: ModelOverrides,
): Promise<ResolvedModel> {
  const requestedProvider = overrides?.provider?.trim().toLowerCase();

  let providerId: ProviderId;
  let modelId: string;

  if (requestedProvider) {
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
