"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createByokStore, type ByokStore } from "@/lib/byok-store";

type ByokStoreApi = ReturnType<typeof createByokStore>;

const ByokStoreContext = createContext<ByokStoreApi | undefined>(undefined);

export function ByokStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createByokStore());

  return (
    <ByokStoreContext.Provider value={store}>
      {children}
    </ByokStoreContext.Provider>
  );
}

export function useByokStore<T>(selector: (store: ByokStore) => T): T {
  const ctx = useContext(ByokStoreContext);
  if (!ctx) {
    throw new Error("useByokStore must be used within <ByokStoreProvider>");
  }
  return useStore(ctx, selector);
}
