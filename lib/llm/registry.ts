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

function resolveKey(
  override: string | undefined,
  provider: ProviderId,
): string {
  const key = override?.trim();
  if (!key) {
    throw new LlmError(
      "missing_api_key",
      `No API key available for "${provider}". Add your own key in the app.`,
      400,
    );
  }
  return key;
}

export function resolveApiKey(
  provider: ProviderId,
  override?: string,
): string {
  return resolveKey(override, provider);
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
      const baseURL = creds.baseURL?.trim();
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

  if (requestedProvider) {
    if (!isProviderId(requestedProvider)) {
      throw new LlmError(
        "unknown_provider",
        `Unknown provider "${requestedProvider}". Valid options: ${PROVIDER_IDS.join(", ")}.`,
        400,
      );
    }
    providerId = requestedProvider;
  } else {
    providerId = "openai";
  }

  const modelId = PROVIDERS[providerId].lockedModel;

  const model = await registry[providerId].createModel(modelId, {
    apiKey: overrides?.apiKey,
    baseURL: overrides?.baseURL,
  });

  return { providerId, modelId, model };
}
