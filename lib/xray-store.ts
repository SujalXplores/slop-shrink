import { createStore } from "zustand/vanilla";

export interface XRayState {
  xrayMode: boolean;
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
    toggleXray: () => set((s) => ({ xrayMode: !s.xrayMode, revealed: {} })),
    setXrayMode: (on) => set({ xrayMode: on, revealed: {} }),
    revealParagraph: (index) =>
      set((s) => ({ revealed: { ...s.revealed, [index]: true } })),
    resetReveals: () => set({ revealed: {} }),
  }));
