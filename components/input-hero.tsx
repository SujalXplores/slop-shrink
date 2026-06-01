'use client';

import { AlertTriangle, Loader2, Pencil, ScanLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { openKeyModal } from '@/components/key-modal';
import { useByokStore } from '@/components/providers/byok-store-provider';
import { useScanStore } from '@/components/providers/scan-store-provider';
import { byokHeaders } from '@/lib/byok';
import { PROVIDERS } from '@/lib/providers';
import { MIN_TOTAL_WORDS, cn, countWords } from '@/lib/utils';

import type { ScanResult } from '@/lib/types';

type Mode = 'url' | 'text';

const EXAMPLE_URL = 'https://en.wikipedia.org/wiki/Information_theory';
const EXAMPLE_TEXT =
  "In today's fast-paced and ever-evolving digital landscape, it is more important than ever to truly understand the power of synergy. At the end of the day, leveraging cutting-edge solutions can unlock a world of possibilities. Many experts agree that thinking outside the box is absolutely essential. The global market grew 14% in 2023 to $1.2 trillion, driven largely by enterprise adoption. Ultimately, the journey of a thousand miles begins with a single step toward holistic transformation.";

function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function InputHero() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byokProvider = useByokStore((s) => s.provider);
  const byokApiKey = useByokStore((s) => s.apiKey);
  const byokBaseURL = useByokStore((s) => s.baseURL);
  const saveScan = useScanStore((s) => s.saveScan);

  const words = useMemo(() => countWords(text), [text]);
  const urlOk = useMemo(() => isValidHttpUrl(url), [url]);
  const canSubmit = mode === 'url' ? urlOk : words >= MIN_TOTAL_WORDS;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    const meta = PROVIDERS[byokProvider];
    if (meta.usesApiKey && !byokApiKey.trim()) {
      openKeyModal();
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const body = mode === 'url' ? { url: url.trim() } : { text };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...byokHeaders({
            provider: byokProvider,
            apiKey: byokApiKey,
            baseURL: byokBaseURL,
          }),
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as {
        scan?: ScanResult;
        message?: string;
      } | null;
      if (!res.ok || !data?.scan) {
        throw new Error(data?.message ?? 'Analysis failed. Please try again.');
      }
      saveScan(data.scan);
      router.push(`/scan/${data.scan.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <section className="relative">
      <p
        className="animate-rise text-ink-faint mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] uppercase"
        style={{ '--rise-delay': '60ms' } as React.CSSProperties}
      >
        <span className="bg-slop h-px w-8" />
        Information density desk
      </p>

      <h1
        className="animate-rise font-display text-ink text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.96] font-light tracking-tight"
        style={{ '--rise-delay': '120ms' } as React.CSSProperties}
      >
        Most of what
        <br className="hidden sm:block" /> you read is{' '}
        <em className="pen-strike text-slop font-semibold not-italic">slop</em>.
      </h1>

      <p
        className="animate-rise border-slop text-ink-dim mt-7 max-w-xl border-l-2 pl-4 font-sans text-lg leading-relaxed"
        style={{ '--rise-delay': '220ms' } as React.CSSProperties}
      >
        Submit a URL or raw text. SlopShrink reads every paragraph like a ruthless editor &mdash;
        scoring information density, striking the filler, and marking up the facts, numbers, and
        steps worth keeping.
      </p>

      <form
        onSubmit={handleSubmit}
        className="animate-rise scan-sweep glass mt-10 rounded-sm p-2"
        style={{ '--rise-delay': '320ms' } as React.CSSProperties}
      >
        <div className="border-line-bright bg-void/40 relative z-10 border border-dashed p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Input mode"
              className="border-ink inline-flex overflow-hidden rounded-sm border"
            >
              {(['url', 'text'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={cn(
                    'cursor-pointer px-4 py-1.5 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-colors',
                    mode === m ? 'bg-ink text-void' : 'bg-panel text-ink-faint hover:text-ink',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <span className="text-ink-faint font-mono text-[10px] tracking-[0.18em] uppercase">
              {mode === 'url'
                ? urlOk
                  ? 'target locked'
                  : 'awaiting url'
                : words >= MIN_TOTAL_WORDS
                  ? `${words} words`
                  : `${words} / ${MIN_TOTAL_WORDS} words`}
            </span>
          </div>

          {mode === 'url' ? (
            <input
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://example.com/the-article-to-mark-up"
              aria-label="Article URL"
              className="text-ink placeholder:text-ink-faint/60 w-full bg-transparent font-mono text-sm focus:outline-none sm:text-base"
            />
          ) : (
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              rows={6}
              placeholder="Paste the copy you suspect is mostly padding…"
              aria-label="Raw text"
              className="text-ink placeholder:text-ink-faint/60 w-full resize-none bg-transparent font-sans text-base leading-relaxed focus:outline-none"
            />
          )}

          <div className="border-line-bright mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-ink-faint font-mono text-[10px] tracking-[0.18em] uppercase">
                proofs:
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode('url');
                  setUrl(EXAMPLE_URL);
                  setError(null);
                }}
                className="border-line-bright bg-panel text-ink-dim hover:border-ink hover:text-ink cursor-pointer rounded-sm border px-2.5 py-1 font-mono text-[11px] transition-colors"
              >
                a wikipedia article
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('text');
                  setText(EXAMPLE_TEXT);
                  setError(null);
                }}
                className="border-line-bright bg-panel text-ink-dim hover:border-slop hover:text-slop cursor-pointer rounded-sm border px-2.5 py-1 font-mono text-[11px] transition-colors"
              >
                a slop sample
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              aria-busy={loading}
              className="group bg-slop text-void enabled:shadow-print-sm disabled:bg-panel-2 disabled:text-ink-faint inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-2.5 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? 'marking up' : 'mark it up'}
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Pencil
                  className="size-3.5 transition-transform group-enabled:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <p className="text-ink-faint mt-4 flex items-center gap-2 font-mono text-xs" role="status">
          <ScanLine className="text-slop size-3.5 animate-pulse" aria-hidden="true" />
          marking up every paragraph for information density
          <span className="caret-blink text-slop">_</span>
        </p>
      )}
      {error && !loading && (
        <p className="text-slop mt-4 flex items-center gap-2 font-mono text-xs" role="alert">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </section>
  );
}
