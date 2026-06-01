import { STORAGE_KEYS } from './stores/keys';
import { createSessionStore, type PersistedCreator } from './stores/session-store';

import type { ProviderId } from './providers';

export interface ByokState {
  provider: ProviderId;
  apiKey: string;
  baseURL: string;
}

export interface ByokActions {
  setProvider: (p: ProviderId) => void;
  setApiKey: (k: string) => void;
  setBaseURL: (u: string) => void;
  setCredentials: (c: Partial<ByokState>) => void;
  clearCredentials: () => void;
}

export type ByokStore = ByokState & ByokActions;

export const defaultByokState: ByokState = {
  provider: 'openai',
  apiKey: '',
  baseURL: '',
};

const creator: PersistedCreator<ByokStore> = (set) => ({
  ...defaultByokState,
  setProvider: (p) => set({ provider: p }),
  setApiKey: (k) => set({ apiKey: k }),
  setBaseURL: (u) => set({ baseURL: u }),
  setCredentials: (c) => set(c),
  clearCredentials: () => set({ apiKey: '', baseURL: '' }),
});

export const createByokStore = () => createSessionStore({ name: STORAGE_KEYS.byok, creator });
