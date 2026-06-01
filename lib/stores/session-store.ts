import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createStore as createVanillaStore } from 'zustand/vanilla';

export type PersistedCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T,
  store: {
    setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
    getState: () => T;
  },
) => T;

const sessionStorageShim: StateStorage = {
  getItem: (name) => {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(name);
  },
};

export interface SessionStoreOptions<T> {
  name: string;
  creator: PersistedCreator<T>;
}

export function createSessionStore<T>({ name, creator }: SessionStoreOptions<T>) {
  return createVanillaStore<T>()(
    persist(creator, {
      name,
      storage: createJSONStorage(() => sessionStorageShim),
    }),
  );
}
