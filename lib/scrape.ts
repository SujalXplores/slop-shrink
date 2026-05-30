import "server-only";

import * as cheerio from "cheerio";

import { ScrapeError } from "./errors";

/**
 * URL → clean article paragraphs.
 *
 * Fetches with a custom UA, a hard timeout, a manual redirect cap, and a byte
 * cap; rejects non-HTML and obvious internal hosts (basic SSRF guard); then
 * strips chrome (script/style/nav/aside/footer/ads) and lifts the title plus
 * the main content split into clean paragraphs.
 */

const USER_AGENT =
  "SlopShrinkBot/0.2 (+https://slopshrink.app; information-density scanner)";
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;
const MAX_BYTES = 2_000_000; // 2 MB of HTML is plenty for an article.
const MIN_PARAGRAPH_WORDS = 4;
const MIN_TOTAL_WORDS = 50;

export interface ScrapedArticle {
  /** Resolved <title> (or first <h1>), if any. */
  title?: string;
  /** Final URL after following redirects. */
  url: string;
  /** Cleaned, ordered paragraphs. */
  paragraphs: string[];
}

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Collapse whitespace and drop common citation/edit markers. */
function normalize(text: string): string {
  return text
    .replace(/\[\d+\]/g, "") // [12] reference markers
    .replace(/\[edit\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Reject loopback / private / link-local hosts to limit SSRF surface. */
function assertPublicHost(hostname: string): void {
  const host = hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "[::1]" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) {
    throw new ScrapeError(
      "fetch_failed",
      "Refusing to fetch a private or local address.",
      422,
    );
  }
}

/** Read a response body up to `maxBytes`, truncating rather than buffering it all. */
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
  return new TextDecoder("utf-8").decode(merged);
}

/** Fetch HTML, following up to MAX_REDIRECTS redirects manually. */
async function fetchHtml(rawUrl: string): Promise<{ url: string; html: string }> {
  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    throw new ScrapeError("fetch_failed", "That is not a valid URL.", 422);
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new ScrapeError(
      "fetch_failed",
      "Only http(s) URLs are supported.",
      422,
    );
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    assertPublicHost(target.hostname);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(target, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
    } catch (err) {
      const timedOut = err instanceof Error && err.name === "AbortError";
      throw new ScrapeError(
        "fetch_failed",
        timedOut
          ? "The site took too long to respond."
          : "Could not reach that URL.",
        422,
        { cause: err },
      );
    } finally {
      clearTimeout(timer);
    }

    // Manual redirect handling so we can enforce the hop cap.
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        throw new ScrapeError(
          "fetch_failed",
          "The URL redirected without a destination.",
          422,
        );
      }
      target = new URL(location, target);
      continue;
    }

    if (!res.ok) {
      throw new ScrapeError(
        "fetch_failed",
        `The URL returned HTTP ${res.status}.`,
        422,
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      throw new ScrapeError(
        "not_html",
        `Expected an HTML page but received "${contentType || "unknown content"}".`,
        415,
      );
    }

    const html = await readCapped(res, MAX_BYTES);
    return { url: target.toString(), html };
  }

  throw new ScrapeError(
    "fetch_failed",
    `Too many redirects (more than ${MAX_REDIRECTS}).`,
    422,
  );
}

const STRIP_SELECTOR = [
  "script",
  "style",
  "noscript",
  "template",
  "nav",
  "aside",
  "footer",
  "header",
  "form",
  "iframe",
  "svg",
  "figure figcaption",
  "[aria-hidden='true']",
  "[role='navigation']",
  "[role='banner']",
  "[role='contentinfo']",
  ".ad",
  ".ads",
  "[class*='advert']",
  "[id*='advert']",
  "[class*='cookie']",
  "[class*='newsletter']",
].join(", ");

const CONTENT_SELECTOR = "p, li, blockquote";

/** Strip chrome and extract the title + clean paragraphs from HTML. */
function extract(html: string): { title?: string; paragraphs: string[] } {
  const $ = cheerio.load(html);

  $(STRIP_SELECTOR).remove();

  const rawTitle = ($("title").first().text() || $("h1").first().text()).trim();
  const title = normalize(rawTitle) || undefined;

  // Prefer a semantic content container; fall back to the whole body.
  const article = $("article").first();
  const main = $("main").first();
  const root =
    article.length > 0 ? article : main.length > 0 ? main : $("body");

  const seen = new Set<string>();
  const paragraphs: string[] = [];
  root.find(CONTENT_SELECTOR).each((_, el) => {
    const text = normalize($(el).text());
    if (countWords(text) < MIN_PARAGRAPH_WORDS) return;
    if (seen.has(text)) return; // drop exact duplicates (repeated boilerplate)
    seen.add(text);
    paragraphs.push(text);
  });

  return { title, paragraphs };
}

/**
 * Fetch and parse a URL into a clean article.
 *
 * @throws {ScrapeError} on a bad/blocked URL, network/timeout failure, non-HTML
 *   response, or content too short to analyze.
 */
export async function scrapeUrl(rawUrl: string): Promise<ScrapedArticle> {
  const { url, html } = await fetchHtml(rawUrl);
  const { title, paragraphs } = extract(html);

  const totalWords = paragraphs.reduce((n, p) => n + countWords(p), 0);
  if (paragraphs.length === 0 || totalWords < MIN_TOTAL_WORDS) {
    throw new ScrapeError(
      "too_short",
      "Could not extract enough readable text from that page.",
      422,
    );
  }

  return { title, url, paragraphs };
}
