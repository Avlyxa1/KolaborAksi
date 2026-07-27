import { create } from 'zustand';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import * as authService from '../services/authService';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    nama: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  /**
   * Login via Google Sign-In popup (Firebase) → send ID token to backend.
   */
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Firebase Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. Send ID token to backend
      const response = await authService.loginWithGoogle(idToken);
      const { user, accessToken, refreshToken } = response.data;

      // 3. Persist tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login Google gagal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Login via email and password.
   */
  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login gagal';
      // Extract error message from API response if available
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        set({
          error: axiosError.response?.data?.message || message,
          isLoading: false,
        });
      } else {
        set({ error: message, isLoading: false });
      }
      throw error;
    }
  },

  /**
   * Register with email and password.
   */
  registerWithEmail: async (
    nama: string,
    email: string,
    password: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register({ nama, email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({ user, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registrasi gagal';
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        set({
          error: axiosError.response?.data?.message || message,
          isLoading: false,
        });
      } else {
        set({ error: message, isLoading: false });
      }
      throw error;
    }
  },

  /**
   * Logout — clear tokens and user state.
   */
  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors on logout — still clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null });
    }
  },

  /**
   * Initialize auth state — check if user is already logged in via stored token.
   * Called once on app mount.
   */
  initAuth: async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      set({ isInitialized: true });
      return;
    }

    try {
      const response = await authService.getMe();
      set({ user: response.data, isInitialized: true });
    } catch {
      // Token invalid or expired (refresh interceptor already tried)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isInitialized: true });
    }
  },

  clearError: () => set({ error: null }),
}));
