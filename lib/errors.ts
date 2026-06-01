export type ErrorCode =
  | 'invalid_request'
  | 'missing_api_key'
  | 'unknown_provider'
  | 'fetch_failed'
  | 'not_html'
  | 'too_short'
  | 'analysis_failed'
  | 'length_mismatch'
  | 'models_failed'
  | 'internal_error';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(code: ErrorCode, message: string, status: number, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
  }
}

export class ScrapeError extends AppError {}

export class LlmError extends AppError {}

export interface ErrorBody {
  error: ErrorCode;
  message: string;
}

export function errorResponse(err: unknown, fallbackMessage: string): Response {
  if (err instanceof AppError) {
    return Response.json({ error: err.code, message: err.message } satisfies ErrorBody, {
      status: err.status,
    });
  }
  console.error('[errorResponse] unexpected error:', err);
  return Response.json({ error: 'internal_error', message: fallbackMessage } satisfies ErrorBody, {
    status: 500,
  });
}
