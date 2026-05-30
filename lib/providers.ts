/**
 * Public, client-safe provider catalog.
 *
 * This is the SINGLE source of truth for the supported provider ids. It is
 * deliberately free of any SDK imports or `server-only` guard so it can be
 * shared by BOTH the browser (the BYOK key modal / store) and the server (the
 * `lib/llm/registry.ts` model factory validates request input against
 * `PROVIDER_IDS` here). No secrets live in this module — only display metadata.
 */

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
  /** Human label for the provider select. */
  label: string;
  /** The server-side default model id — shown as the model input's placeholder. */
  defaultModel: string;
  /** False for local providers (Ollama) that take a base URL instead of a key. */
  usesApiKey: boolean;
  /** Where the user obtains a key (rendered as a help link in the modal). */
  keyUrl?: string;
  /** Hint at the key's shape, used as the masked input's placeholder. */
  keyPlaceholder?: string;
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    defaultModel: "gpt-4o-mini",
    usesApiKey: true,
    keyUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-…",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    defaultModel: "claude-haiku-4-5",
    usesApiKey: true,
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-…",
  },
  google: {
    id: "google",
    label: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    usesApiKey: true,
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyPlaceholder: "AIza…",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    defaultModel: "openai/gpt-4o-mini",
    usesApiKey: true,
    keyUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-…",
  },
  ollama: {
    id: "ollama",
    label: "Ollama (local)",
    defaultModel: "llama3.2",
    usesApiKey: false,
    keyPlaceholder: "http://127.0.0.1:11434/api",
  },
};

/** Ordered list for rendering the provider select. */
export const PROVIDER_LIST: ProviderMeta[] = PROVIDER_IDS.map(
  (id) => PROVIDERS[id],
);

/** Narrowing guard — validates an untrusted string (e.g. a request header). */
export function isProviderId(value: string): value is ProviderId {
  return (PROVIDER_IDS as readonly string[]).includes(value);
}
