'use client';

import { createXRayStore, type XRayStore } from '@/lib/xray-store';

import { createStoreProvider } from './create-store-provider';

const { Provider, useStore } = createStoreProvider<XRayStore>({
  errorMessage: 'useXRayStore must be used within <XRayStoreProvider>',
  createStore: createXRayStore,
});

export const XRayStoreProvider = Provider;
export const useXRayStore = useStore;
