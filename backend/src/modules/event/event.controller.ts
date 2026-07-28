import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import {
  createEventSchema,
  updateEventSchema,
  updateEventStatusSchema,
  eventQuerySchema,
} from './event.schema.js';
import * as eventService from './event.service.js';

export async function handleCreate(req: Request, res: Response): Promise<void> {
  try {
    const input = createEventSchema.parse(req.body);
    const userId = (req as Request & { userId: string }).userId;

    if (req.file) {
      input.gambarUrl = `/uploads/${req.file.filename}`;
    }

    const result = await eventService.createEvent(input, userId);
    sendSuccess(res, result, 'Event berhasil dibuat', 201);
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
    const message = error instanceof Error ? error.message : 'Gagal membuat event';
    const status = message.includes('akses') || message.includes('tidak ditemukan') ? 403 : 500;
    sendError(res, message, status);
  }
}

export async function handleGetAll(req: Request, res: Response): Promise<void> {
  try {
    const query = eventQuerySchema.parse(req.query);
    const result = await eventService.getEvents(query);
    sendSuccess(res, result, 'Berhasil mengambil daftar event');
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
      error instanceof Error ? error.message : 'Gagal mengambil daftar event',
      500,
    );
  }
}

export async function handleGetById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await eventService.getEventById(id as string);
    sendSuccess(res, result, 'Berhasil mengambil data event');
  } catch (error) {
    sendError(
      res,
      error instanceof Error ? error.message : 'Event tidak ditemukan',
      404,
    );
  }
}

export async function handleUpdate(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateEventSchema.parse(req.body);
    const userId = (req as Request & { userId: string }).userId;

    if (req.file) {
      input.gambarUrl = `/uploads/${req.file.filename}`;
    }

    const result = await eventService.updateEvent(id as string, input, userId);
    sendSuccess(res, result, 'Event berhasil diperbarui');
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
    const message = error instanceof Error ? error.message : 'Gagal memperbarui event';
    const status = message.includes('akses') ? 403 : 500;
    sendError(res, message, status);
  }
}

export async function handleUpdateStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateEventStatusSchema.parse(req.body);
    const userId = (req as Request & { userId: string }).userId;

    const result = await eventService.updateEventStatus(id as string, input, userId);
    sendSuccess(res, result, 'Status event berhasil diperbarui');
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
    const message = error instanceof Error ? error.message : 'Gagal memperbarui status event';
    const status = message.includes('akses') ? 403 : 500;
    sendError(res, message, status);
  }
}

export async function handleDelete(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as Request & { userId: string }).userId;

    await eventService.deleteEvent(id as string, userId);
    sendSuccess(res, null, 'Event berhasil dihapus');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus event';
    const status = message.includes('akses') ? 403 : 500;
    sendError(res, message, status);
  }
}
