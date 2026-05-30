import { listModels } from "@/lib/llm/models";
import { AppError } from "@/lib/errors";
import { isProviderId } from "@/lib/providers";

/**
 * GET /api/models
 *
 * Lists the model ids available for a provider so the BYOK modal can offer a
 * picklist instead of free text. The provider + credentials arrive as the same
 * headers the scan uses (`x-llm-provider`, `x-llm-key`, `x-llm-base-url`).
 *
 * SECURITY: the key is read from a header, forwarded to the provider, and NEVER
 * logged, echoed, or persisted. `nodejs` runtime: the fetcher needs Node fetch
 * + the (server-only) provider modules.
 */
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  const provider = request.headers.get("x-llm-provider")?.trim();
  if (!provider || !isProviderId(provider)) {
    return Response.json(
      {
        error: "unknown_provider",
        message: "Provide a valid provider to list models.",
      },
      { status: 400 },
    );
  }

  const apiKey = request.headers.get("x-llm-key")?.trim() || undefined;
  const baseURL = request.headers.get("x-llm-base-url")?.trim() || undefined;

  try {
    const models = await listModels(provider, { apiKey, baseURL });
    return Response.json({ models }, { status: 200 });
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { error: err.code, message: err.message },
        { status: err.status },
      );
    }
    // Never include the key or provider internals in the surfaced message.
    console.error("[/api/models] unexpected error:", err);
    return Response.json(
      { error: "internal_error", message: "Could not list models." },
      { status: 500 },
    );
  }
}
