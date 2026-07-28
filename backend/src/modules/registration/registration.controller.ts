import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import * as registrationService from './registration.service.js';
import { createRegistrationSchema, updateRegistrationStatusSchema } from './registration.schema.js';

export const createRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const userId = (req as Request & { userId: string }).userId;
    const input = createRegistrationSchema.parse(req.body);

    const registration = await registrationService.createRegistration(eventId as string, userId, input.alasan);
    sendSuccess(res, registration, 'Pendaftaran berhasil', 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      sendError(res, 'Validasi gagal', 400, error.errors.map((e) => e.message));
      return;
    }
    sendError(res, error.message || 'Gagal melakukan pendaftaran', 400);
  }
};

export const updateRegistrationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const input = updateRegistrationStatusSchema.parse(req.body);

    const updatedRegistration = await registrationService.updateRegistrationStatus(id as string, input.status);
    sendSuccess(res, updatedRegistration, 'Status pendaftaran berhasil diperbarui', 200);
  } catch (error: any) {
    if (error instanceof ZodError) {
      sendError(res, 'Validasi gagal', 400, error.errors.map((e) => e.message));
      return;
    }
    sendError(res, error.message || 'Gagal memperbarui status pendaftaran', 400);
  }
};

export const getEventRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.query;
    const userId = (req as Request & { userId: string }).userId;

    if (!eventId || typeof eventId !== 'string') {
      sendError(res, 'eventId query parameter is required', 400);
      return;
    }

    const registrations = await registrationService.getRegistrationsByEvent(eventId, userId);
    sendSuccess(res, registrations, 'Berhasil mengambil data pendaftaran');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil data pendaftaran', 400);
  }
};

export const getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const { eventId } = req.query;

    const registrations = await registrationService.getMyRegistrations(userId, eventId as string);
    sendSuccess(res, registrations, 'Berhasil mengambil daftar pendaftaran Anda');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil daftar pendaftaran Anda', 400);
  }
};
