import { z } from 'zod';

/**
 * Schema for Google Sign-In: frontend sends the Firebase ID token.
 */
export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'ID token is required'),
});

/**
 * Schema for email/password registration.
 */
export const registerSchema = z.object({
  nama: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password maksimal 128 karakter'),
});

/**
 * Schema for email/password login.
 */
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

/**
 * Schema for refresh token request.
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
