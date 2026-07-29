import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import * as volunteerHourService from './volunteerHour.service.js';
import { verifyHoursSchema } from './volunteerHour.schema.js';

/**
 * POST /api/volunteer-hours/:registrationId/verify
 * Panitia inputs and verifies volunteer hours for a registration.
 */
export const verifyHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;
    const userId = (req as Request & { userId: string }).userId;
    const input = verifyHoursSchema.parse(req.body);

    const volunteerHour = await volunteerHourService.verifyVolunteerHours(
      registrationId as string,
      input.jumlahJam,
      userId,
      input.catatan,
    );

    sendSuccess(res, volunteerHour, 'Jam kontribusi berhasil diverifikasi', 200);
  } catch (error: any) {
    if (error instanceof ZodError) {
      sendError(res, 'Validasi gagal', 400, error.errors.map((e) => e.message));
      return;
    }
    sendError(res, error.message || 'Gagal memverifikasi jam kontribusi', 400);
  }
};
