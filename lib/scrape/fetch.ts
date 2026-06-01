import { ScrapeError } from '../errors';
import { assertHttpProtocol, assertPublicHost } from './security';

const USER_AGENT =
  'SlopShrinkBot/0.2 (+https://slop-shrink.vercel.app; information-density scanner)';
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MAX_BYTES = 2_000_000;

export interface FetchedPage {
  url: string;
  html: string;
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return (await res.text()).slice(0, maxBytes);

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    if (total + value.byteLength > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - total));
      await reader.cancel();
      break;
    }
    chunks.push(value);
    total += value.byteLength;
  }

  const merged = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder('utf-8').decode(merged);
}

export async function fetchHtml(rawUrl: string): Promise<FetchedPage> {
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    throw new ScrapeError('fetch_failed', 'That is not a valid URL.', 422);
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    assertHttpProtocol(target);
    assertPublicHost(target.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(target, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'AbortError';
      throw new ScrapeError(
        'fetch_failed',
        timedOut ? 'The site took too long to respond.' : 'Could not reach that URL.',
        422,
        { cause: err },
      );
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) {
        throw new ScrapeError('fetch_failed', 'The URL redirected without a destination.', 422);
      }
      target = new URL(location, target);
      continue;
    }

    if (!res.ok) {
      throw new ScrapeError('fetch_failed', `The URL returned HTTP ${res.status}.`, 422);
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new ScrapeError(
        'not_html',
        `Expected an HTML page but received "${contentType || 'unknown content'}".`,
        415,
      );
    }

    const html = await readCapped(res, MAX_BYTES);
    return { url: target.toString(), html };
  }

  throw new ScrapeError('fetch_failed', `Too many redirects (more than ${MAX_REDIRECTS}).`, 422);
}
