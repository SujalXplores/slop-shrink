export const PROVIDER_IDS = [
  "openai",
  "anthropic",
  "google",
  "openrouter",
  "ollama",
] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

export interface ProviderMeta {
  id: ProviderId;
  label: string;
  lockedModel: string;
  usesApiKey: boolean;
  keyUrl?: string;
  keyPlaceholder?: string;
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    lockedModel: "gpt-5.5-instant",
    usesApiKey: true,
    keyUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-…",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    lockedModel: "claude-opus-4-7-20260512",
    usesApiKey: true,
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-…",
  },
  google: {
    id: "google",
    label: "Google Gemini",
    lockedModel: "gemini-3.5-flash",
    usesApiKey: true,
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIza…",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    lockedModel: "openai/gpt-5.5",
    usesApiKey: true,
    keyUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-…",
  },
  ollama: {
    id: "ollama",
    label: "Ollama (local)",
    lockedModel: "llama3.3",
    usesApiKey: false,
    keyPlaceholder: "http://127.0.0.1:11434/api",
  },
};

export const PROVIDER_LIST: ProviderMeta[] = PROVIDER_IDS.map(
  (id) => PROVIDERS[id],
);

export function isProviderId(value: string): value is ProviderId {
  return (PROVIDER_IDS as readonly string[]).includes(value);
}
