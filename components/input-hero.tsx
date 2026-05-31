'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useByokStore } from '@/components/providers/byok-store-provider';
import { PROVIDERS } from '@/lib/providers';
import { openKeyModal } from '@/components/key-modal';
import { cn, countWords, MIN_TOTAL_WORDS } from '@/lib/utils';
import { byokHeaders } from '@/lib/byok';

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
        id?: string;
        message?: string;
      } | null;
      if (!res.ok || !data?.id) {
        throw new Error(data?.message ?? 'Analysis failed. Please try again.');
      }
      router.push(`/scan/${data.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      );
      setLoading(false);
    }
  }

  return (
    <section className="relative">
      <h1
        className="animate-rise font-read text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.98] tracking-tight text-ink"
        style={{ '--rise-delay': '120ms' } as React.CSSProperties}
      >
        Most of what you read
        <br />
        is{' '}
        <em className="font-medium not-italic text-slop text-glow-slop">
          slop
        </em>
        .
      </h1>

      <p
        className="animate-rise mt-6 max-w-xl font-read text-lg leading-relaxed text-ink-dim"
        style={{ '--rise-delay': '200ms' } as React.CSSProperties}
      >
        Paste a URL or raw text. SlopShrink x-rays every paragraph for
        information density, collapsing the filler and spotlighting the facts,
        numbers, and steps worth keeping.
      </p>

      <form
        onSubmit={handleSubmit}
        className="animate-rise scan-sweep glass mt-10 rounded-2xl p-2.5"
        style={{ '--rise-delay': '300ms' } as React.CSSProperties}
      >
        <div className="relative z-10 rounded-xl bg-void/40 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Input mode"
              className="panel inline-flex rounded-lg p-0.5"
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
                    'cursor-pointer rounded-md px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors',
                    mode === m
                      ? 'bg-panel-2 text-signal ring-glow-signal'
                      : 'text-ink-faint hover:text-ink-dim',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
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
              placeholder="https://example.com/the-article-you-want-to-x-ray"
              aria-label="Article URL"
              className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-faint/60 focus:outline-none sm:text-base"
            />
          ) : (
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              rows={6}
              placeholder="Paste the text you suspect is mostly padding…"
              aria-label="Raw text"
              className="w-full resize-none bg-transparent font-read text-base leading-relaxed text-ink placeholder:text-ink-faint/60 focus:outline-none"
            />
          )}

          <div className="mt-4 flex flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                try:
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode('url');
                  setUrl(EXAMPLE_URL);
                  setError(null);
                }}
                className="cursor-pointer panel rounded-md px-2.5 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:text-signal"
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
                className="cursor-pointer panel rounded-md px-2.5 py-1 font-mono text-[11px] text-ink-dim transition-colors hover:text-signal"
              >
                a slop sample
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              aria-busy={loading}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-signal px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void transition-all enabled:hover:brightness-110 enabled:hover:ring-glow-signal disabled:cursor-not-allowed disabled:bg-panel-2 disabled:text-ink-faint"
            >
              {loading ? 'x-raying' : 'run x-ray'}
              <span
                className={cn(
                  loading
                    ? 'caret-blink'
                    : 'transition-transform group-enabled:group-hover:translate-x-0.5',
                )}
              >
                {loading ? '…' : '▸'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <p className="mt-4 font-mono text-xs text-ink-faint" role="status">
          <span className="text-signal">▰▰▰</span>
          <span className="mx-2 text-line-bright">·</span>
          x-raying every paragraph for information density
          <span className="caret-blink text-signal">_</span>
        </p>
      )}
      {error && !loading && (
        <p className="mt-4 font-mono text-xs text-slop" role="alert">
          ✕ {error}
        </p>
      )}
    </section>
  );
}
