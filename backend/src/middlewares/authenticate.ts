import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/responseHelper.js';

/**
 * Extend Express Request to include auth data set by this middleware.
 */
export interface AuthenticatedRequest extends Request {
  userId: string;
  userEmail: string;
  userRole: string;
}

/**
 * Middleware: verify JWT access token from Authorization header.
 *
 * Expects: `Authorization: Bearer <token>`
 * Sets: `req.userId`, `req.userEmail`, `req.userRole`
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Token tidak ditemukan', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    sendError(res, 'Token tidak valid', 401);
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    // Attach user data to request object
    (req as AuthenticatedRequest).userId = decoded.userId;
    (req as AuthenticatedRequest).userEmail = decoded.email;
    (req as AuthenticatedRequest).userRole = decoded.role;

    next();
  } catch {
    sendError(res, 'Token tidak valid atau sudah kedaluwarsa', 401);
  }
}
