import type { Response } from 'express';

/**
 * Standard success response format per CODING_AGENT.md Section 5.
 *
 * { success: true, data: T, message: string }
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

/**
 * Standard error response format per CODING_AGENT.md Section 5.
 *
 * { success: false, message: string, errors: string[] }
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors: string[] = [],
): void {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
