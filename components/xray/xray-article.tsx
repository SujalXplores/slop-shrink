'use client';

import { Check, Scissors, Undo2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useXRayStore } from '@/components/providers/xray-store-provider';
import { TIER_FILL, TIER_LABEL, TIER_TEXT, TIER_TRACK } from '@/lib/tier-styles';
import { cn, densityTier } from '@/lib/utils';

import type { ScanResult } from '@/lib/types';

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
            <div className="absolute top-0 bottom-0 left-0 w-1 overflow-hidden rounded-full">
              <div
                className={cn('h-full w-full transition-colors duration-300', TIER_TRACK[tier])}
              />
              <div
                className={cn(
                  'absolute bottom-0 left-0 w-full rounded-full transition-all duration-500',
                  TIER_FILL[tier],
                )}
                style={{ height: `${Math.max(analysis.densityScore, 8)}%` }}
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
                      'mb-1.5 flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] uppercase',
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
                      ? 'text-ink-faint decoration-slop/70 line-through decoration-1'
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
                    className="group/cut border-slop/40 bg-slop/5 hover:border-slop/70 hover:bg-slop/10 flex cursor-pointer items-center gap-2.5 rounded-sm border border-dashed px-2.5 py-1.5 text-left transition-colors"
                  >
                    <Scissors className="text-slop size-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-slop-dim font-mono text-[10px] tracking-[0.16em] uppercase">
                      cut by editor
                    </span>
                    <span className="leader border-slop/30" aria-hidden="true" />
                    <span className="text-ink-faint group-hover/cut:text-slop flex items-center gap-1 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors">
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
                    <div className="border-signal bg-signal/[0.06] border-l-2 px-3.5 py-2.5">
                      <p className="text-signal-dim mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                        <Check className="size-3" aria-hidden="true" />
                        editor’s margin notes
                      </p>
                      <ul className="space-y-1.5">
                        {analysis.extractedFacts.map((fact, fi) => (
                          <li
                            key={fi}
                            className="text-signal-dim flex items-start gap-2 font-sans text-[13px] leading-relaxed"
                          >
                            <span className="bg-signal mt-2 h-1 w-1 shrink-0 rounded-full" />
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
