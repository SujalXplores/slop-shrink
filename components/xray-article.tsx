'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useXRayStore } from '@/components/providers/xray-store-provider';
import { densityTier } from '@/lib/utils';
import type { ScanResult } from '@/lib/types';

const BAR_FILL = { high: 'bg-signal', mid: 'bg-warn', low: 'bg-slop' } as const;
const BAR_TRACK = {
  high: 'bg-signal/40',
  mid: 'bg-warn/40',
  low: 'bg-slop/40',
} as const;

interface XRayArticleProps {
  scan: ScanResult;
}

export function XRayArticle({ scan }: XRayArticleProps) {
  const xrayMode = useXRayStore((s) => s.xrayMode);
  const revealed = useXRayStore((s) => s.revealed);
  const revealParagraph = useXRayStore((s) => s.revealParagraph);

  return (
    <div className="space-y-1">
      {scan.paragraphs.map((paragraph, i) => {
        const analysis = scan.analysis[i];
        if (!analysis) return null;

        const isSlop = analysis.isSlop;
        const isCollapsed = xrayMode && isSlop && !revealed[i];
        const hasFacts = analysis.extractedFacts.length > 0;
        const tier = densityTier(analysis.densityScore);

        return (
          <div key={i} className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5">
              <div
                className={`h-full rounded-full transition-colors duration-300 ${BAR_TRACK[tier]}`}
              />
              <div
                className={`absolute top-0 left-0 w-full rounded-full transition-all duration-500 ${BAR_FILL[tier]}`}
                style={{
                  height: `${Math.max(analysis.densityScore, 8)}%`,
                }}
              />
            </div>

            <div className="pl-4">
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
                <p
                  className={`font-read text-[15px] leading-relaxed transition-colors duration-300 ${
                    xrayMode && isSlop ? 'text-ink-faint' : 'text-ink'
                  }`}
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
                    className="mt-1 flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-panel-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-slop" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slop-dim">
                      slop — click to reveal
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
                    className="mt-2 overflow-hidden"
                  >
                    <div className="rounded-lg border border-signal/20 bg-signal/5 px-3 py-2">
                      <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-signal-dim">
                        extracted facts
                      </p>
                      <ul className="space-y-1">
                        {analysis.extractedFacts.map((fact, fi) => (
                          <li
                            key={fi}
                            className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-signal-dim"
                          >
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-signal" />
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
