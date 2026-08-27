import type { Response } from 'express';
import type { AuthenticatedRequest } from '../../middlewares/authenticate.js';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import * as dashboardService from './dashboard.service.js';

/**
 * GET /api/dashboard/summary
 */
export async function getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId, userRole } = req;
    const orgId = req.query.organizationId as string | undefined;

    const stats = await dashboardService.getSummaryStats(userId, userRole, orgId);
    sendSuccess(res, stats, 'Berhasil mengambil data ringkasan dashboard');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil data ringkasan dashboard', 400);
  }
}

/**
 * GET /api/dashboard/participation-trend
 */
export async function getParticipationTrend(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId, userRole } = req;
    const orgId = req.query.organizationId as string | undefined;

    const trend = await dashboardService.getParticipationTrend(userId, userRole, orgId);
    sendSuccess(res, trend, 'Berhasil mengambil data tren partisipasi');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil data tren partisipasi', 400);
  }
}

/**
 * GET /api/dashboard/category-distribution
 */
export async function getCategoryDistribution(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId, userRole } = req;
    const orgId = req.query.organizationId as string | undefined;

    const distribution = await dashboardService.getCategoryDistribution(userId, userRole, orgId);
    sendSuccess(res, distribution, 'Berhasil mengambil data distribusi kategori');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil data distribusi kategori', 400);
  }
}

/**
 * GET /api/dashboard/recent-activities
 */
export async function getRecentActivities(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { userId, userRole } = req;
    const orgId = req.query.organizationId as string | undefined;

    const activities = await dashboardService.getRecentActivities(userId, userRole, orgId);
    sendSuccess(res, activities, 'Berhasil mengambil data aktivitas terbaru');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil data aktivitas terbaru', 400);
  }
}
