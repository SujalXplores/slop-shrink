import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { ProviderId } from "./providers";

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
  provider: "openai",
  apiKey: "",
  baseURL: "",
};

export const createByokStore = (init: ByokState = defaultByokState) =>
  createStore<ByokStore>()(
    persist(
      (set) => ({
        ...init,
        setProvider: (p) => set({ provider: p }),
        setApiKey: (k) => set({ apiKey: k }),
        setBaseURL: (u) => set({ baseURL: u }),
        setCredentials: (c) => set(c),
        clearCredentials: () => set({ apiKey: "", baseURL: "" }),
      }),
      {
        name: "slopshrink-byok",
        storage: {
          getItem: (name) => {
            const raw = sessionStorage.getItem(name);
            return raw ? (JSON.parse(raw) as { state: ByokState }) : null;
          },
          setItem: (name, value) => {
            sessionStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            sessionStorage.removeItem(name);
          },
        },
      },
    ),
  );
