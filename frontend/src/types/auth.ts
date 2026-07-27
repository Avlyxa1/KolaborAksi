/**
 * User roles matching backend enum.
 */
export type Role = 'admin' | 'panitia' | 'relawan';

/**
 * Authentication provider type.
 */
export type AuthProvider = 'google' | 'email';

/**
 * User object returned from the API.
 */
export interface User {
  id: string;
  nama: string;
  email: string;
  photoUrl: string | null;
  authProvider: AuthProvider;
  role: Role;
  createdAt: string;
}

/**
 * Auth response from login/register endpoints.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Standard API success response wrapper.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

/**
 * Standard API error response wrapper.
 */
export interface ApiError {
  success: false;
  message: string;
  errors: string[];
}
