'use client';

import { createScanStore, type ScanStore } from '@/lib/scan-store';

import { createStoreProvider } from './create-store-provider';

const { Provider, useStore } = createStoreProvider<ScanStore>({
  errorMessage: 'useScanStore must be used within <ScanStoreProvider>',
  createStore: createScanStore,
});

export const ScanStoreProvider = Provider;
export const useScanStore = useStore;
