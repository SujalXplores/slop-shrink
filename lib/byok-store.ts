import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { ProviderId } from "./providers";

/**
 * Client-side BYOK (Bring-Your-Own-Key) credentials.
 * Persisted to sessionStorage so keys survive page navigations within a tab
 * but are wiped when the tab closes. NEVER logged or persisted server-side.
 */

export interface ByokState {
  provider: ProviderId;
  /** Empty string = use the server-side default for the chosen provider. */
  model: string;
  /** API key — empty for Ollama (which uses baseURL instead). */
  apiKey: string;
  /** Base URL override — only relevant for Ollama. */
  baseURL: string;
}

export interface ByokActions {
  setProvider: (p: ProviderId) => void;
  setModel: (m: string) => void;
  setApiKey: (k: string) => void;
  setBaseURL: (u: string) => void;
  setCredentials: (c: Partial<ByokState>) => void;
  clearCredentials: () => void;
}

export type ByokStore = ByokState & ByokActions;

export const defaultByokState: ByokState = {
  provider: "openai",
  model: "",
  apiKey: "",
  baseURL: "",
};

export const createByokStore = (init: ByokState = defaultByokState) =>
  createStore<ByokStore>()(
    persist(
      (set) => ({
        ...init,
        setProvider: (p) => set({ provider: p }),
        setModel: (m) => set({ model: m }),
        setApiKey: (k) => set({ apiKey: k }),
        setBaseURL: (u) => set({ baseURL: u }),
        setCredentials: (c) => set(c),
        clearCredentials: () =>
          set({ model: "", apiKey: "", baseURL: "" }),
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
