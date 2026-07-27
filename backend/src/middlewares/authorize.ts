import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authenticate.js';
import { sendError } from '../utils/responseHelper.js';

/**
 * Middleware: authorize access based on user role.
 *
 * Must be used AFTER `authenticate` middleware.
 * Checks if the authenticated user's role is in the allowed list.
 *
 * Usage: `authorize(['admin', 'panitia'])`
 */
export function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as AuthenticatedRequest).userRole;

    if (!userRole) {
      sendError(res, 'Akses ditolak — tidak terautentikasi', 401);
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      sendError(
        res,
        'Akses ditolak — Anda tidak memiliki izin untuk mengakses resource ini',
        403,
      );
      return;
    }

    next();
  };
}
