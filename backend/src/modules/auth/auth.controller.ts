import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import {
  googleAuthSchema,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.schema.js';
import * as authService from './auth.service.js';

/**
 * POST /api/auth/google
 * Login/register via Google (Firebase ID token).
 */
export async function handleGoogleAuth(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = googleAuthSchema.parse(req.body);
    const result = await authService.googleAuth(input);
    sendSuccess(res, result, 'Login berhasil');
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(
        res,
        'Validasi gagal',
        400,
        error.errors.map((e) => e.message),
      );
      return;
    }
    console.error('[Auth] Google auth error:', error);
    sendError(
      res,
      error instanceof Error ? error.message : 'Login gagal',
      401,
    );
  }
}

/**
 * POST /api/auth/register
 * Register with email and password.
 */
export async function handleRegister(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    sendSuccess(res, result, 'Registrasi berhasil', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(
        res,
        'Validasi gagal',
        400,
        error.errors.map((e) => e.message),
      );
      return;
    }
    const message =
      error instanceof Error ? error.message : 'Registrasi gagal';
    const status = message.includes('sudah terdaftar') ? 409 : 500;
    sendError(res, message, status);
  }
}

/**
 * POST /api/auth/login
 * Login with email and password.
 */
export async function handleLogin(req: Request, res: Response): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    sendSuccess(res, result, 'Login berhasil');
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(
        res,
        'Validasi gagal',
        400,
        error.errors.map((e) => e.message),
      );
      return;
    }
    sendError(
      res,
      error instanceof Error ? error.message : 'Login gagal',
      401,
    );
  }
}

/**
 * POST /api/auth/refresh
 * Get new access token using refresh token.
 */
export async function handleRefreshToken(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const input = refreshTokenSchema.parse(req.body);
    const result = await authService.refreshToken(input);
    sendSuccess(res, result, 'Token berhasil diperbarui');
  } catch (error) {
    if (error instanceof ZodError) {
      sendError(
        res,
        'Validasi gagal',
        400,
        error.errors.map((e) => e.message),
      );
      return;
    }
    sendError(res, 'Refresh token tidak valid', 401);
  }
}

/**
 * GET /api/auth/me
 * Get current authenticated user profile.
 */
export async function handleGetMe(req: Request, res: Response): Promise<void> {
  try {
    // userId is set by authenticate middleware
    const userId = (req as Request & { userId: string }).userId;
    const user = await authService.getMe(userId);
    sendSuccess(res, user);
  } catch (error) {
    sendError(
      res,
      error instanceof Error ? error.message : 'Gagal mengambil data user',
      404,
    );
  }
}

/**
 * POST /api/auth/logout
 * Invalidate refresh token.
 */
export async function handleLogout(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as Request & { userId: string }).userId;
    await authService.logout(userId);
    sendSuccess(res, null, 'Logout berhasil');
  } catch (error) {
    sendError(
      res,
      error instanceof Error ? error.message : 'Logout gagal',
      500,
    );
  }
}
