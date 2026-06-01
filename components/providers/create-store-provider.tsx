'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore as useZustandStore } from 'zustand';

import type { StoreApi } from 'zustand/vanilla';

export interface StoreProviderOptions<TStore> {
  errorMessage: string;
  createStore: () => StoreApi<TStore>;
}

export interface StoreProviderResult<TStore> {
  Provider: (props: { children: ReactNode }) => React.ReactNode;
  useStore: <T>(selector: (store: TStore) => T) => T;
}

export function createStoreProvider<TStore>({
  errorMessage,
  createStore,
}: StoreProviderOptions<TStore>): StoreProviderResult<TStore> {
  const Context = createContext<StoreApi<TStore> | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }): React.ReactNode {
    const [store] = useState<StoreApi<TStore>>(() => createStore());
    return <Context.Provider value={store}>{children}</Context.Provider>;
  }

  function useStore<T>(selector: (store: TStore) => T): T {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(errorMessage);
    return useZustandStore(ctx, selector);
  }

  return { Provider, useStore };
}
