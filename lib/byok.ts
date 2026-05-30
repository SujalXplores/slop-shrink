export const BYOK_HEADERS = {
  provider: "x-llm-provider",
  model: "x-llm-model",
  apiKey: "x-llm-key",
  baseURL: "x-llm-base-url",
} as const;

export interface ByokCredentials {
  provider?: string;
  model?: string;
  apiKey?: string;
  baseURL?: string;
}

export function byokHeaders(creds: ByokCredentials): Record<string, string> {
  const headers: Record<string, string> = {};
  if (creds.provider?.trim()) headers[BYOK_HEADERS.provider] = creds.provider.trim();
  if (creds.model?.trim()) headers[BYOK_HEADERS.model] = creds.model.trim();
  if (creds.apiKey?.trim()) headers[BYOK_HEADERS.apiKey] = creds.apiKey.trim();
  if (creds.baseURL?.trim()) headers[BYOK_HEADERS.baseURL] = creds.baseURL.trim();
  return headers;
}

export function readByokHeaders(headers: Headers): ByokCredentials {
  return {
    provider: headers.get(BYOK_HEADERS.provider)?.trim() || undefined,
    model: headers.get(BYOK_HEADERS.model)?.trim() || undefined,
    apiKey: headers.get(BYOK_HEADERS.apiKey)?.trim() || undefined,
    baseURL: headers.get(BYOK_HEADERS.baseURL)?.trim() || undefined,
  };
}
