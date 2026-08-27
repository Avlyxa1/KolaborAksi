import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import * as dashboardController from './dashboard.controller.js';

const router = Router();

// Protect all dashboard routes: only authenticated admin and panitia
router.use(authenticate);
router.use(authorize(['admin', 'panitia']));

router.get('/summary', dashboardController.getSummary as any);
router.get('/participation-trend', dashboardController.getParticipationTrend as any);
router.get('/category-distribution', dashboardController.getCategoryDistribution as any);
router.get('/recent-activities', dashboardController.getRecentActivities as any);

export default router;
