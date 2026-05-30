import { listModels } from "@/lib/llm/models";
import { AppError } from "@/lib/errors";
import { isProviderId } from "@/lib/providers";
import { readByokHeaders } from "@/lib/byok";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  const { provider, apiKey, baseURL } = readByokHeaders(request.headers);
  if (!provider || !isProviderId(provider)) {
    return Response.json(
      {
        error: "unknown_provider",
        message: "Provide a valid provider to list models.",
      },
      { status: 400 },
    );
  }

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
    console.error("[/api/models] unexpected error:", err);
    return Response.json(
      { error: "internal_error", message: "Could not list models." },
      { status: 500 },
    );
  }
}
