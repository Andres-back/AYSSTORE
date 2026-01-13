import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { User, ApiResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
            '/auth/login',
            { email, password }
          );

          if (data.success && data.data) {
            const { user, token } = data.data;
            localStorage.setItem('token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
            '/auth/register',
            registerData
          );

          if (data.success && data.data) {
            const { user, token } = data.data;
            localStorage.setItem('token', token);
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const { data } = await api.get<ApiResponse<User>>('/auth/me');
          if (data.success && data.data) {
            set({
              user: data.data,
              token,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
