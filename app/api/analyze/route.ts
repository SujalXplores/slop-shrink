import { z } from "zod";

import { analyze, type AnalyzeInput } from "@/lib/analyze";
import { AppError } from "@/lib/errors";
import { isProviderId } from "@/lib/providers";
import { readByokHeaders } from "@/lib/byok";
import type { ModelOverrides } from "@/lib/llm/registry";

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
    // Scans are persisted client-side (sessionStorage) rather than in server
    // memory, which does not survive across serverless instances/invocations.
    // Return the full result so the browser can store it and render /scan/[id].
    return Response.json({ scan: result }, { status: 201 });
  } catch (err) {
    if (err instanceof AppError) {
      return Response.json(
        { error: err.code, message: err.message },
        { status: err.status },
      );
    }
    console.error("[/api/analyze] unexpected error:", err);
    return Response.json(
      { error: "internal_error", message: "Something went wrong while analyzing." },
      { status: 500 },
    );
  }
}

function extractOverrides(request: Request): ModelOverrides | undefined {
  const creds = readByokHeaders(request.headers);

  if (!creds.provider && !creds.apiKey && !creds.baseURL) {
    return undefined;
  }

  if (creds.provider && !isProviderId(creds.provider)) {
    throw new AppError(
      "unknown_provider",
      `Unknown provider "${creds.provider}".`,
      400,
    );
  }

  return creds;
}
