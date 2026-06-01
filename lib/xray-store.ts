import { createStore as createVanillaStore } from 'zustand/vanilla';

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
  xrayMode: true,
  revealed: {},
};

export const createXRayStore = () =>
  createVanillaStore<XRayStore>()((set) => ({
    ...defaultXRayState,
    toggleXray: () => set((s) => ({ xrayMode: !s.xrayMode, revealed: {} })),
    setXrayMode: (on) => set({ xrayMode: on, revealed: {} }),
    revealParagraph: (index) => set((s) => ({ revealed: { ...s.revealed, [index]: true } })),
    resetReveals: () => set({ revealed: {} }),
  }));
