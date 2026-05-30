import { z } from "zod";

import { analyze, type AnalyzeInput } from "@/lib/analyze";
import { saveScan } from "@/lib/storage";
import { AppError } from "@/lib/errors";
import { isProviderId } from "@/lib/providers";
import type { ModelOverrides } from "@/lib/llm/registry";

/**
 * POST /api/analyze
 *
 * Body: `{ url: string }` OR `{ text: string }`.
 * Runs a scan, persists it, and returns `{ id }` (201). Failures are mapped to
 * typed JSON errors with the right status code.
 *
 * `nodejs` runtime: the scraper (Cheerio + streamed fetch) and the provider
 * SDKs rely on Node APIs.
 */
export const runtime = "nodejs";

const bodySchema = z.union([
  z.object({ url: z.url() }),
  z.object({ text: z.string().trim().min(1) }),
]);

export async function POST(request: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json(
      { error: "invalid_request", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      {
        error: "invalid_request",
        message: "Provide a valid { url } or a non-empty { text }.",
      },
      { status: 400 },
    );
  }

  try {
    const overrides = extractOverrides(request);
    const result = await analyze(parsed.data as AnalyzeInput, overrides);
    saveScan(result);
    return Response.json({ id: result.id }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { error: err.code, message: err.message },
        { status: err.status },
      );
    }
    // Unexpected: log server-side, return a generic message (no internals leak).
    console.error("[/api/analyze] unexpected error:", err);
    return Response.json(
      { error: "internal_error", message: "Something went wrong while analyzing." },
      { status: 500 },
    );
  }
}

/**
 * Extract optional per-request BYOK overrides from request headers.
 * The key is NEVER logged or persisted server-side.
 */
function extractOverrides(request: Request): ModelOverrides | undefined {
  const provider = request.headers.get("x-llm-provider")?.trim() || undefined;
  const model = request.headers.get("x-llm-model")?.trim() || undefined;
  const apiKey = request.headers.get("x-llm-key")?.trim() || undefined;
  const baseURL = request.headers.get("x-llm-base-url")?.trim() || undefined;

  if (!provider && !model && !apiKey && !baseURL) return undefined;

  if (provider && !isProviderId(provider)) {
    throw new AppError(
      "unknown_provider",
      `Unknown provider "${provider}".`,
      400,
    );
  }

  return { provider, model, apiKey, baseURL };
}
