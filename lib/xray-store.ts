import { createStore } from "zustand/vanilla";

/**
 * Client-side UI state for the X-Ray viewer.
 *
 * Per the official Zustand "Setup with Next.js" guidance we expose a *factory*
 * (not a module-level global) so the App Router can create one isolated store
 * per request via a Context provider — see `xray-store-provider.tsx`.
 */

export interface XRayState {
  /** When true, slop paragraphs collapse and facts get spotlighted. */
  xrayMode: boolean;
  /** Paragraph indices the reader manually expanded while in X-Ray mode. */
  revealed: Record<number, boolean>;
}

export interface XRayActions {
  toggleXray: () => void;
  setXrayMode: (on: boolean) => void;
  revealParagraph: (index: number) => void;
  resetReveals: () => void;
}

export type XRayStore = XRayState & XRayActions;

export const defaultXRayState: XRayState = {
  xrayMode: false,
  revealed: {},
};

export const createXRayStore = (init: XRayState = defaultXRayState) =>
  createStore<XRayStore>()((set) => ({
    ...init,
    // Toggling the lens resets any manual peeks so each pass starts clean.
    toggleXray: () => set((s) => ({ xrayMode: !s.xrayMode, revealed: {} })),
    setXrayMode: (on) => set({ xrayMode: on, revealed: {} }),
    revealParagraph: (index) =>
      set((s) => ({ revealed: { ...s.revealed, [index]: true } })),
    resetReveals: () => set({ revealed: {} }),
  }));
