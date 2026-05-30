'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createXRayStore, type XRayStore } from '@/lib/xray-store';

type XRayStoreApi = ReturnType<typeof createXRayStore>;

const XRayStoreContext = createContext<XRayStoreApi | undefined>(undefined);

export function XRayStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createXRayStore());

  return (
    <XRayStoreContext.Provider value={store}>
      {children}
    </XRayStoreContext.Provider>
  );
}

export function useXRayStore<T>(selector: (store: XRayStore) => T): T {
  const ctx = useContext(XRayStoreContext);
  if (!ctx) {
    throw new Error('useXRayStore must be used within <XRayStoreProvider>');
  }
  return useStore(ctx, selector);
}
