import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'shopai-access-token';
let authRevision = 0;
let storageQueue: Promise<unknown> = Promise.resolve();

function withAuthStorage<T>(action: () => Promise<T>): Promise<T> {
  const operation = storageQueue.then(action);
  storageQueue = operation.catch(() => undefined);
  return operation;
}

interface AuthState {
  token: string | null;
  hasHydrated: boolean;
  initialize: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  hasHydrated: false,
  initialize: async () => {
    const revision = authRevision;
    try {
      const token = await withAuthStorage(() => SecureStore.getItemAsync(AUTH_TOKEN_KEY));
      if (revision === authRevision) {set({token});}
    } catch {
      if (revision === authRevision) {set({token: null});}
    } finally {
      set({hasHydrated: true});
    }
  },
  login: async token => {
    const revision = ++authRevision;
    await withAuthStorage(() => SecureStore.setItemAsync(AUTH_TOKEN_KEY, token));
    if (revision === authRevision) {set({token, hasHydrated: true});}
  },
  logout: async () => {
    ++authRevision;
    set({token: null});
    try {
      await withAuthStorage(() => SecureStore.deleteItemAsync(AUTH_TOKEN_KEY));
    } catch {
      // Clear in-memory auth even if the OS keychain is temporarily unavailable.
    }
  },
}));
