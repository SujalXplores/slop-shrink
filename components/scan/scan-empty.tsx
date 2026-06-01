'use client';

import { FileWarning, Pencil } from 'lucide-react';
import Link from 'next/link';

export function ScanEmpty() {
  return (
    <div className="glass flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center">
      <FileWarning className="text-slop size-10" aria-hidden="true" />
      <div>
        <p className="text-ink-dim font-mono text-sm tracking-[0.2em] uppercase">
          galley not found
        </p>
        <p className="text-ink-faint mt-2 max-w-sm font-sans text-[15px] leading-relaxed">
          This markup lives in this browser tab and could not be found here. Galleys are stored
          locally, so links from another device or after closing the tab will not resolve. Run a
          fresh submission to fill it.
        </p>
      </div>
      <Link
        href="/"
        className="bg-slop text-void shadow-print-sm mt-1 inline-flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 font-mono text-xs font-bold tracking-[0.18em] uppercase transition-all hover:-translate-y-px"
      >
        new submission
        <Pencil className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
