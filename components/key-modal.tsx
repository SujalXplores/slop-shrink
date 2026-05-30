'use client';

import { useCallback, useEffect, useState } from 'react';
import { useByokStore } from '@/components/providers/byok-store-provider';
import { PROVIDER_LIST, PROVIDERS, type ProviderId } from '@/lib/providers';
import { byokHeaders } from '@/lib/byok';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
} from '@/components/ui/autocomplete';

type ModelsStatus = 'idle' | 'loading' | 'loaded' | 'error';

export function KeyModal() {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [modelsStatus, setModelsStatus] = useState<ModelsStatus>('idle');
  const [modelsError, setModelsError] = useState<string | null>(null);

  const provider = useByokStore((s) => s.provider);
  const model = useByokStore((s) => s.model);
  const apiKey = useByokStore((s) => s.apiKey);
  const baseURL = useByokStore((s) => s.baseURL);
  const setProvider = useByokStore((s) => s.setProvider);
  const setModel = useByokStore((s) => s.setModel);
  const setApiKey = useByokStore((s) => s.setApiKey);
  const setBaseURL = useByokStore((s) => s.setBaseURL);
  const clearCredentials = useByokStore((s) => s.clearCredentials);

  const meta = PROVIDERS[provider];

  const handleClear = useCallback(() => {
    clearCredentials();
    setShowKey(false);
    setModels([]);
    setModelsStatus('idle');
    setModelsError(null);
  }, [clearCredentials]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener('byok:open', onOpen);
    return () => document.removeEventListener('byok:open', onOpen);
  }, []);

  const needsKey = meta.usesApiKey;
  useEffect(() => {
    if (!open) return;
    const key = apiKey.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (needsKey && !key) {
        setModels([]);
        setModelsStatus('idle');
        setModelsError(null);
        return;
      }
      setModelsStatus('loading');
      setModelsError(null);
      try {
        const res = await fetch('/api/models', {
          headers: byokHeaders({ provider, apiKey: key, baseURL }),
          signal: controller.signal,
        });
        const data = (await res.json().catch(() => null)) as {
          models?: string[];
          message?: string;
        } | null;
        if (!res.ok) {
          throw new Error(data?.message ?? 'Could not load models.');
        }
        setModels(Array.isArray(data?.models) ? data.models : []);
        setModelsStatus('loaded');
      } catch (err) {
        if (controller.signal.aborted) return;
        setModels([]);
        setModelsStatus('error');
        setModelsError(
          err instanceof Error ? err.message : 'Could not load models.',
        );
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [open, provider, apiKey, baseURL, needsKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="border-line bg-panel p-0 shadow-2xl sm:max-w-md"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-ink">
              API Key
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              bring your own key
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            render={
              <button
                type="button"
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel-2 hover:text-ink"
              />
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
            </svg>
          </DialogClose>
        </div>

        <div className="px-6 py-5">
          <FieldGroup>
            <div className="flex items-start gap-3 rounded-lg border border-signal/20 bg-signal/5 px-3.5 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="mt-0.5 shrink-0 text-signal"
              >
                <path
                  d="M7 1L2 3.5v3.5c0 3.5 2.5 5.5 5 6.5 2.5-1 5-3 5-6.5V3.5L7 1z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 7l1.5 1.5L9 5.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-mono text-[10px] leading-relaxed text-signal-dim">
                Your key stays in this browser, is sent only to run your scan,
                and is never stored on our servers. Cleared when the tab closes.
              </p>
            </div>

            <Field>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Provider
              </FieldLabel>
              <Select
                value={provider}
                onValueChange={(v) => {
                  setProvider(v as ProviderId);
                  setModel('');
                }}
              >
                <SelectTrigger className="h-9 w-full border-line bg-panel-2 pl-3 text-left font-mono text-sm text-ink">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-line bg-panel-2 shadow-xl">
                  {PROVIDER_LIST.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="font-mono text-sm text-ink focus:bg-signal/10 focus:text-signal"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Model{' '}
                <span className="text-ink-faint/50">
                  (blank = provider default)
                </span>
              </FieldLabel>
              <Autocomplete
                items={models}
                value={model}
                onValueChange={setModel}
              >
                <AutocompleteInput
                  placeholder={meta.defaultModel}
                  autoComplete="off"
                  spellCheck={false}
                  className="border-line bg-panel-2 font-mono text-ink placeholder:text-ink-faint/40"
                />
                <AutocompleteContent className="border border-line bg-panel-2 shadow-xl">
                  <AutocompleteList>
                    {(item: string) => (
                      <AutocompleteItem
                        key={item}
                        value={item}
                        className="font-mono text-ink data-highlighted:bg-signal/10 data-highlighted:text-signal"
                      >
                        {item}
                      </AutocompleteItem>
                    )}
                  </AutocompleteList>
                  <AutocompleteEmpty className="font-mono text-ink-faint">
                    no match — type any model id
                  </AutocompleteEmpty>
                </AutocompleteContent>
              </Autocomplete>
              <p
                className="mt-1.5 font-mono text-[10px] tracking-[0.04em] text-ink-faint"
                role="status"
                aria-live="polite"
              >
                {modelsStatus === 'loading' && (
                  <span className="text-signal-dim">
                    <span className="caret-blink">▰</span> loading models…
                  </span>
                )}
                {modelsStatus === 'loaded' &&
                  (models.length > 0 ? (
                    <span className="text-signal-dim">
                      {models.length} compatible models — pick or type one
                    </span>
                  ) : (
                    <span>no compatible models returned — type a model id</span>
                  ))}
                {modelsStatus === 'error' && (
                  <span className="text-slop-dim">
                    ✕ {modelsError} — you can still type a model id
                  </span>
                )}
                {modelsStatus === 'idle' &&
                  (needsKey ? (
                    <span>enter your API key above to load models</span>
                  ) : (
                    <span>models load from your Ollama server</span>
                  ))}
              </p>
            </Field>

            {meta.usesApiKey ? (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                    API Key
                  </FieldLabel>
                  {meta.keyUrl && (
                    <a
                      href={meta.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] text-signal-dim transition-colors hover:text-signal"
                    >
                      get key ↗
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={meta.keyPlaceholder}
                    autoComplete="off"
                    spellCheck={false}
                    className="h-9 border-line bg-panel-2 pr-16 font-mono text-sm text-ink placeholder:text-ink-faint/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint transition-colors hover:bg-panel hover:text-ink-dim"
                  >
                    {showKey ? 'hide' : 'show'}
                  </button>
                </div>
              </Field>
            ) : (
              <Field>
                <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  Base URL
                </FieldLabel>
                <Input
                  type="url"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                  placeholder={meta.keyPlaceholder}
                  className="h-9 border-line bg-panel-2 font-mono text-sm text-ink placeholder:text-ink-faint/40"
                />
              </Field>
            )}
          </FieldGroup>
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="h-8 border-line bg-transparent font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint hover:border-slop/50 hover:bg-slop/5 hover:text-slop"
          >
            Clear Key
          </Button>
          <DialogClose
            render={
              <Button className="h-8 bg-signal px-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-void hover:brightness-110" />
            }
          >
            Save & Close
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function openKeyModal() {
  document.dispatchEvent(new Event('byok:open'));
}
