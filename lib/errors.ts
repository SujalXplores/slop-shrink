/**
 * Domain errors shared across the server.
 *
 * Every failure that should reach the client carries a stable, machine-readable
 * `code` and an HTTP `status`, so the `/api/analyze` Route Handler can translate
 * a thrown error into a typed JSON response in one place — without leaking
 * secrets, stack traces, or provider internals to the browser.
 */

export type ErrorCode =
  | "invalid_request"
  | "missing_api_key"
  | "unknown_provider"
  | "fetch_failed"
  | "not_html"
  | "too_short"
  | "analysis_failed"
  | "length_mismatch"
  | "models_failed"
  | "internal_error";

export class AppError extends Error {
  readonly code: ErrorCode;
  /** HTTP status to surface for this failure. */
  readonly status: number;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    // `new.target.name` keeps the subclass name (ScrapeError/LlmError) on the
    // instance for clearer server logs.
    this.name = new.target.name;
    this.code = code;
    this.status = status;
  }
}

/** Raised while fetching or parsing a URL into clean paragraphs. */
export class ScrapeError extends AppError {}

/** Raised while resolving a provider or running the structured model call. */
export class LlmError extends AppError {}
