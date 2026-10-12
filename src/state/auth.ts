import { create } from 'zustand';
import { api, type User } from '../lib/api';
import { startSync, stopSync } from './sync';

interface AuthState {
  status: 'loading' | 'guest' | 'user';
  user: User | null;
  /** El servidor usa el buzón de pruebas en lugar de SMTP real */
  devMailbox: boolean;
  init: () => Promise<void>;
  login: (login: string, password: string, remember: boolean) => Promise<void>;
  register: (data: { name: string; username: string; email: string; password: string; level: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: User) => void;
  /** Tras restablecer la contraseña el servidor ya abre sesión */
  signedIn: (u: User) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  status: 'loading',
  user: null,
  devMailbox: false,

  init: async () => {
    try {
      const { user, devMailbox } = await api.get<{ user: User | null; devMailbox: boolean }>('/auth/me');
      set({ devMailbox });
      if (user) await get().signedIn(user);
      else set({ status: 'guest', user: null });
    } catch {
      set({ status: 'guest', user: null });
    }
  },

  login: async (login, password, remember) => {
    const { user } = await api.post<{ user: User }>('/auth/login', { login, password, remember });
    await get().signedIn(user);
  },

  register: async (data) => {
    const { user } = await api.post<{ user: User }>('/auth/register', data);
    await get().signedIn(user);
  },

  logout: async () => {
    await stopSync(true);
    await api.post('/auth/logout').catch(() => {});
    set({ status: 'guest', user: null });
  },

  setUser: (user) => set({ user }),

  signedIn: async (user) => {
    set({ user, status: 'user' });
    await startSync();
  },
}));
