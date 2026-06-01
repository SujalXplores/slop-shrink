'use client';

import { createByokStore, type ByokStore } from '@/lib/byok-store';

import { createStoreProvider } from './create-store-provider';

const { Provider, useStore } = createStoreProvider<ByokStore>({
  errorMessage: 'useByokStore must be used within <ByokStoreProvider>',
  createStore: createByokStore,
});

export const ByokStoreProvider = Provider;
export const useByokStore = useStore;
