import 'server-only';

import { MIN_TOTAL_WORDS } from './constants';
import { ScrapeError } from './errors';
import { extractArticle } from './scrape/extract';
import { fetchHtml } from './scrape/fetch';
import { countWords } from './utils';

export interface ScrapedArticle {
  title?: string;
  url: string;
  paragraphs: string[];
}

export async function scrapeUrl(rawUrl: string): Promise<ScrapedArticle> {
  const { url, html } = await fetchHtml(rawUrl);
  const { title, paragraphs } = extractArticle(html);

  const totalWords = paragraphs.reduce((n, p) => n + countWords(p), 0);
  if (paragraphs.length === 0 || totalWords < MIN_TOTAL_WORDS) {
    throw new ScrapeError(
      'too_short',
      'Could not extract enough readable text from that page.',
      422,
    );
  }

  return { title, url, paragraphs };
}
