'use client';

import { ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useByokStore } from '@/components/providers/byok-store-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDER_LIST, PROVIDERS, type ProviderId } from '@/lib/providers';

export function KeyModal() {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const provider = useByokStore((s) => s.provider);
  const apiKey = useByokStore((s) => s.apiKey);
  const baseURL = useByokStore((s) => s.baseURL);
  const setProvider = useByokStore((s) => s.setProvider);
  const setApiKey = useByokStore((s) => s.setApiKey);
  const setBaseURL = useByokStore((s) => s.setBaseURL);
  const clearCredentials = useByokStore((s) => s.clearCredentials);

  const meta = PROVIDERS[provider];

  const handleClear = useCallback(() => {
    clearCredentials();
    setShowKey(false);
  }, [clearCredentials]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    document.addEventListener('byok:open', onOpen);
    return () => document.removeEventListener('byok:open', onOpen);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="border-ink bg-panel shadow-print overflow-hidden border-2 p-0 ring-0 sm:max-w-md"
      >
        <div className="border-ink flex items-center justify-between border-b-2 px-6 py-4">
          <DialogHeader className="gap-0.5">
            <DialogTitle className="font-display text-ink text-lg font-semibold tracking-tight">
              Press credentials
            </DialogTitle>
            <DialogDescription className="text-ink-faint font-mono text-[10px] tracking-[0.14em] uppercase">
              bring your own key
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            render={
              <button
                type="button"
                aria-label="Close"
                className="text-ink-faint hover:bg-panel-2 hover:text-slop flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm transition-colors"
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
            <div className="border-signal/20 bg-signal/5 flex items-start gap-3 rounded-lg border px-3.5 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-signal mt-0.5 shrink-0"
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
              <p className="text-signal-dim font-mono text-[10px] leading-relaxed">
                Your key stays in this browser, is sent only to run your scan, and is never stored
                on our servers. Cleared when the tab closes.
              </p>
            </div>

            <Field>
              <FieldLabel className="text-ink-faint font-mono text-[10px] tracking-[0.18em] uppercase">
                Provider
              </FieldLabel>
              <Select
                value={provider}
                onValueChange={(v) => {
                  setProvider(v as ProviderId);
                }}
              >
                <SelectTrigger className="border-line bg-panel-2 text-ink h-9 w-full pl-3 text-left font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-line bg-panel-2 shadow-xl">
                  {PROVIDER_LIST.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="text-ink focus:bg-signal/10 focus:text-signal font-mono text-sm"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-ink-faint mt-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.04em]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-signal-dim shrink-0"
                >
                  <rect
                    x="2.5"
                    y="6"
                    width="9"
                    height="6"
                    rx="1.4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-ink-faint tracking-[0.14em] uppercase">model</span>
                <span className="text-ink-dim font-semibold">{meta.lockedModel}</span>
                <span className="text-ink-faint/70 ml-auto">best-tier · auto</span>
              </div>
            </Field>

            {meta.usesApiKey ? (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-ink-faint font-mono text-[10px] tracking-[0.18em] uppercase">
                    API Key
                  </FieldLabel>
                  {meta.keyUrl && (
                    <a
                      href={meta.keyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-signal-dim hover:text-signal inline-flex cursor-pointer items-center gap-1 font-mono text-[9px] transition-colors"
                    >
                      get key
                      <ExternalLink className="size-2.5" aria-hidden="true" />
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
                    className="border-line bg-panel-2 text-ink placeholder:text-ink-faint/40 h-9 pr-16 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-ink-faint hover:bg-panel hover:text-ink-dim absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors"
                  >
                    {showKey ? 'hide' : 'show'}
                  </button>
                </div>
              </Field>
            ) : (
              <Field>
                <FieldLabel className="text-ink-faint font-mono text-[10px] tracking-[0.18em] uppercase">
                  Base URL
                </FieldLabel>
                <Input
                  type="url"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                  placeholder={meta.keyPlaceholder}
                  className="border-line bg-panel-2 text-ink placeholder:text-ink-faint/40 h-9 font-mono text-sm"
                />
              </Field>
            )}
          </FieldGroup>
        </div>

        <div className="border-ink flex items-center justify-between border-t-2 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="border-line-bright text-ink-faint hover:border-slop hover:bg-slop/5 hover:text-slop h-8 rounded-sm bg-transparent font-mono text-[11px] tracking-[0.14em] uppercase"
          >
            Clear Key
          </Button>
          <DialogClose
            render={
              <Button className="bg-ink text-void shadow-print-sm h-8 rounded-sm px-4 font-mono text-xs font-bold tracking-[0.18em] uppercase transition-transform hover:-translate-y-px" />
            }
          >
            Save &amp; Close
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function openKeyModal() {
  document.dispatchEvent(new Event('byok:open'));
}
