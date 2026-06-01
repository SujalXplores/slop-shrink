import * as cheerio from 'cheerio';

import { countWords } from '../utils';

const MIN_PARAGRAPH_WORDS = 4;

const STRIP_SELECTOR = [
  'script',
  'style',
  'noscript',
  'template',
  'nav',
  'aside',
  'footer',
  'header',
  'form',
  'iframe',
  'svg',
  'figure figcaption',
  "[aria-hidden='true']",
  "[role='navigation']",
  "[role='banner']",
  "[role='contentinfo']",
  '.ad',
  '.ads',
  "[class*='advert']",
  "[id*='advert']",
  "[class*='cookie']",
  "[class*='newsletter']",
].join(', ');

const CONTENT_SELECTOR = 'p, li, blockquote';

export interface ExtractedArticle {
  title?: string;
  paragraphs: string[];
}

function normalize(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/\[edit\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractArticle(html: string): ExtractedArticle {
  const $ = cheerio.load(html);

  $(STRIP_SELECTOR).remove();

  const rawTitle = ($('title').first().text() || $('h1').first().text()).trim();
  const title = normalize(rawTitle) || undefined;

  const article = $('article').first();
  const main = $('main').first();
  const root = article.length > 0 ? article : main.length > 0 ? main : $('body');

  const seen = new Set<string>();
  const paragraphs: string[] = [];
  root.find(CONTENT_SELECTOR).each((_, el) => {
    const text = normalize($(el).text());
    if (countWords(text) < MIN_PARAGRAPH_WORDS) return;
    if (seen.has(text)) return;
    seen.add(text);
    paragraphs.push(text);
  });

  return { title, paragraphs };
}
