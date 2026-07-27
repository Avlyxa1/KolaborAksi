import api from './api';
import type { ApiResponse, AuthResponse, User } from '../types/auth';

/**
 * Send Google Firebase ID token to backend for verification and JWT issuance.
 */
export async function loginWithGoogle(
  idToken: string,
): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/google', {
    idToken,
  });
  return response.data;
}

/**
 * Register a new account with email and password.
 */
export async function register(data: {
  nama: string;
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data,
  );
  return response.data;
}

/**
 * Login with email and password.
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    data,
  );
  return response.data;
}

/**
 * Get current authenticated user profile.
 */
export async function getMe(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data;
}

/**
 * Logout — invalidate refresh token on backend.
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
