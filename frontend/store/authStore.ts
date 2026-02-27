/**
 * Zustand global auth store.
 * Manages user login state across the entire app.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout:  () => Promise<void>;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  restore: async () => {
    const token = await AsyncStorage.getItem('medai_token');
    const user  = await AsyncStorage.getItem('medai_user');
    set({ token, user: user ? JSON.parse(user) : null, loading: false });
  },

  login: async (email: string, password: string) => {
    const res: any = await authAPI.login({ email, password });
    await AsyncStorage.setItem('medai_token', res.token);
    await AsyncStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  register: async (data: any) => {
    const res: any = await authAPI.register(data);
    await AsyncStorage.setItem('medai_token', res.token);
    await AsyncStorage.setItem('medai_user', JSON.stringify(res.user));
    set({ token: res.token, user: res.user });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['medai_token', 'medai_user']);
    set({ token: null, user: null });
  },
}));
