'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createScanStore, type ScanStore } from '@/lib/scan-store';

type ScanStoreApi = ReturnType<typeof createScanStore>;

const ScanStoreContext = createContext<ScanStoreApi | undefined>(undefined);

export function ScanStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createScanStore());

  return (
    <ScanStoreContext.Provider value={store}>
      {children}
    </ScanStoreContext.Provider>
  );
}

export function useScanStore<T>(selector: (store: ScanStore) => T): T {
  const ctx = useContext(ScanStoreContext);
  if (!ctx) {
    throw new Error('useScanStore must be used within <ScanStoreProvider>');
  }
  return useStore(ctx, selector);
}
