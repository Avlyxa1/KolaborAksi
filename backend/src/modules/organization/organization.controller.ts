import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from './organization.schema.js';
import * as orgService from './organization.service.js';

export async function handleCreate(req: Request, res: Response): Promise<void> {
  try {
    const input = createOrganizationSchema.parse(req.body);
    // userId is set by authenticate middleware
    const userId = (req as Request & { userId: string }).userId;
    
    // Check if there's a file uploaded
    if (req.file) {
      input.logoUrl = `/uploads/${req.file.filename}`;
    }

    const result = await orgService.createOrganization(input, userId);
    sendSuccess(res, result, 'Organisasi berhasil dibuat', 201);
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
      error instanceof Error ? error.message : 'Gagal membuat organisasi',
      500,
    );
  }
}

export async function handleGetAll(_req: Request, res: Response): Promise<void> {
  try {
    const result = await orgService.getOrganizations();
    sendSuccess(res, result, 'Berhasil mengambil daftar organisasi');
  } catch (error) {
    sendError(
      res,
      error instanceof Error ? error.message : 'Gagal mengambil daftar organisasi',
      500,
    );
  }
}

export async function handleGetById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await orgService.getOrganizationById(id as string);
    sendSuccess(res, result, 'Berhasil mengambil data organisasi');
  } catch (error) {
    sendError(
      res,
      error instanceof Error ? error.message : 'Organisasi tidak ditemukan',
      404,
    );
  }
}

export async function handleUpdate(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const input = updateOrganizationSchema.parse(req.body);
    const userId = (req as Request & { userId: string }).userId;

    if (req.file) {
      input.logoUrl = `/uploads/${req.file.filename}`;
    }

    const result = await orgService.updateOrganization(id as string, input, userId);
    sendSuccess(res, result, 'Organisasi berhasil diperbarui');
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
    const message = error instanceof Error ? error.message : 'Gagal memperbarui organisasi';
    const status = message.includes('akses') ? 403 : 500;
    sendError(res, message, status);
  }
}

export async function handleDelete(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as Request & { userId: string }).userId;

    await orgService.deleteOrganization(id as string, userId);
    sendSuccess(res, null, 'Organisasi berhasil dihapus');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus organisasi';
    const status = message.includes('akses') ? 403 : 500;
    sendError(res, message, status);
  }
}
