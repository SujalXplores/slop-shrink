import { Pencil } from 'lucide-react';
import Link from 'next/link';

export function Colophon() {
  return (
    <section
      aria-label="Get started"
      className="border-ink border-t-[3px] border-double py-16 sm:py-24"
    >
      <div className="glass relative overflow-hidden p-8 text-center sm:p-14">
        <span
          aria-hidden="true"
          className="font-display text-slop/10 pointer-events-none absolute -top-10 -right-4 text-[12rem] leading-none select-none sm:text-[16rem]"
        >
          ¶
        </span>
        <p className="text-slop font-mono text-[10px] font-bold tracking-[0.28em] uppercase">
          last edition
        </p>
        <h2 className="font-display text-ink mx-auto mt-3 max-w-2xl text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
          Send it to the desk.
        </h2>
        <p className="font-display text-ink-dim mx-auto mt-4 max-w-md text-[1.2rem] leading-relaxed italic">
          Paste a URL or a block of text and let the editor mark it up. No account, no setup file —
          just your key and a page worth shrinking.
        </p>
        <Link
          href="#top"
          className="bg-slop text-void shadow-print-sm mt-7 inline-flex cursor-pointer items-center gap-2 rounded-sm px-6 py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-px active:translate-y-0 active:shadow-none"
        >
          mark up a page
          <Pencil className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
