"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { createXRayStore, type XRayStore } from "@/lib/xray-store";

type XRayStoreApi = ReturnType<typeof createXRayStore>;

const XRayStoreContext = createContext<XRayStoreApi | undefined>(undefined);

export function XRayStoreProvider({ children }: { children: ReactNode }) {
  // Lazy initializer → created exactly once per mount (per request), never as a
  // shared module-level global. This is the App Router-safe Zustand pattern.
  const [store] = useState(() => createXRayStore());

  return (
    <XRayStoreContext.Provider value={store}>
      {children}
    </XRayStoreContext.Provider>
  );
}

/**
 * Select from the X-Ray store. Pass an atomic selector (single value) to keep
 * re-renders minimal. For object/array selectors, wrap with `useShallow` from
 * `zustand/react/shallow` — returning a fresh reference each render loops in v5.
 */
export function useXRayStore<T>(selector: (store: XRayStore) => T): T {
  const ctx = useContext(XRayStoreContext);
  if (!ctx) {
    throw new Error("useXRayStore must be used within <XRayStoreProvider>");
  }
  return useStore(ctx, selector);
}
