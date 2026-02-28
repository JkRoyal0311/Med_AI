/**
 * Zustand global auth store for web.
 * Manages user login state across the entire app.
 */
import { create } from 'zustand';
import { authAPI } from '../services/api';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout:  () => void;
  restore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  restore: () => {
    const token = localStorage.getItem('medai_token');
    const user  = localStorage.getItem('medai_user');
    set({ token, user: user ? JSON.parse(user) : null, loading: false });
  },

  login: async (email: string, password: string) => {
    const res: any = await authAPI.login({ email, password });
    localStorage.setItem('medai_token', res.token);
    localStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  register: async (data: any) => {
    const res: any = await authAPI.register(data);
    localStorage.setItem('medai_token', res.token);
    localStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  logout: () => {
    localStorage.removeItem('medai_token');
    localStorage.removeItem('medai_user');
  },
}));
