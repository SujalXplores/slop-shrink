'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Scissors, Undo2, Check } from 'lucide-react';
import { useXRayStore } from '@/components/providers/xray-store-provider';
import { cn, densityTier } from '@/lib/utils';
import type { ScanResult } from '@/lib/types';

const BAR_FILL = { high: 'bg-signal', mid: 'bg-warn', low: 'bg-slop' } as const;
const BAR_TRACK = {
  high: 'bg-signal/25',
  mid: 'bg-warn/25',
  low: 'bg-slop/25',
} as const;
const TIER_TEXT = {
  high: 'text-signal-dim',
  mid: 'text-warn',
  low: 'text-slop-dim',
} as const;
const TIER_LABEL = { high: 'keep', mid: 'trim', low: 'cut' } as const;

interface XRayArticleProps {
  scan: ScanResult;
}

export function XRayArticle({ scan }: XRayArticleProps) {
  const xrayMode = useXRayStore((s) => s.xrayMode);
  const revealed = useXRayStore((s) => s.revealed);
  const revealParagraph = useXRayStore((s) => s.revealParagraph);

  return (
    <div className="space-y-6">
      {scan.paragraphs.map((paragraph, i) => {
        const analysis = scan.analysis[i];
        if (!analysis) return null;

        const isSlop = analysis.isSlop;
        const isCollapsed = xrayMode && isSlop && !revealed[i];
        const hasFacts = analysis.extractedFacts.length > 0;
        const tier = densityTier(analysis.densityScore);

        return (
          <div key={i} id={`p-${i}`} className="group/p relative scroll-mt-28">
            <div className="absolute bottom-0 left-0 top-0 w-1 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full w-full transition-colors duration-300',
                  BAR_TRACK[tier],
                )}
              />
              <div
                className={cn(
                  'absolute bottom-0 left-0 w-full rounded-full transition-all duration-500',
                  BAR_FILL[tier],
                )}
                style={{
                  height: `${Math.max(analysis.densityScore, 8)}%`,
                }}
              />
            </div>

            <div className="pl-5">
              <motion.div
                layout
                initial={false}
                animate={{
                  height: isCollapsed ? 0 : 'auto',
                  opacity: isCollapsed ? 0 : 1,
                }}
                transition={{
                  height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden"
              >
                {xrayMode && (
                  <span
                    className={cn(
                      'mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em]',
                      TIER_TEXT[tier],
                    )}
                  >
                    <span className="stamp border-current py-[0.1rem] text-[8px]">
                      {TIER_LABEL[tier]}
                    </span>
                    density · {analysis.densityScore}
                  </span>
                )}
                <p
                  className={cn(
                    'font-sans text-[1.0625rem] leading-[1.75] transition-colors duration-300',
                    xrayMode && isSlop
                      ? 'text-ink-faint line-through decoration-slop/70 decoration-1'
                      : 'text-ink',
                  )}
                >
                  {paragraph}
                </p>
              </motion.div>

              <AnimatePresence>
                {isCollapsed && (
                  <motion.button
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    onClick={() => revealParagraph(i)}
                    className="group/cut flex cursor-pointer items-center gap-2.5 rounded-sm border border-dashed border-slop/40 bg-slop/5 px-2.5 py-1.5 text-left transition-colors hover:border-slop/70 hover:bg-slop/10"
                  >
                    <Scissors className="size-3.5 shrink-0 text-slop" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slop-dim">
                      cut by editor
                    </span>
                    <span className="leader border-slop/30" aria-hidden="true" />
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint transition-colors group-hover/cut:text-slop">
                      restore
                      <Undo2 className="size-3" aria-hidden="true" />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {xrayMode && hasFacts && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    className="mt-2.5 overflow-hidden"
                  >
                    <div className="border-l-2 border-signal bg-signal/[0.06] px-3.5 py-2.5">
                      <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-signal-dim">
                        <Check className="size-3" aria-hidden="true" />
                        editor’s margin notes
                      </p>
                      <ul className="space-y-1.5">
                        {analysis.extractedFacts.map((fact, fi) => (
                          <li
                            key={fi}
                            className="flex items-start gap-2 font-sans text-[13px] leading-relaxed text-signal-dim"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                            {fact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
