import { z } from 'zod';

import { analyze, type AnalyzeInput } from '@/lib/analyze';
import { readByokHeaders } from '@/lib/byok';
import { AppError, errorResponse } from '@/lib/errors';
import { isProviderId } from '@/lib/providers';

import type { ModelOverrides } from '@/lib/llm/registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
      { error: 'invalid_request', message: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      {
        error: 'invalid_request',
        message: 'Provide a valid { url } or a non-empty { text }.',
      },
      { status: 400 },
    );
  }

  try {
    const overrides = extractOverrides(request);
    const result = await analyze(parsed.data as AnalyzeInput, overrides);
    return Response.json({ scan: result }, { status: 201 });
  } catch (err) {
    return errorResponse(err, 'Something went wrong while analyzing.');
  }
}

function extractOverrides(request: Request): ModelOverrides | undefined {
  const creds = readByokHeaders(request.headers);

  if (!creds.provider && !creds.apiKey && !creds.baseURL) {
    return undefined;
  }

  if (creds.provider && !isProviderId(creds.provider)) {
    throw new AppError('unknown_provider', `Unknown provider "${creds.provider}".`, 400);
  }

  return creds as ModelOverrides;
}
