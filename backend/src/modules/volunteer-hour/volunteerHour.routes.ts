import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import * as volunteerHourController from './volunteerHour.controller.js';

const router = Router();

// Verifikasi jam kontribusi (panitia & admin)
router.post(
  '/:registrationId/verify',
  authenticate,
  authorize(['panitia', 'admin']),
  volunteerHourController.verifyHours,
);

export default router;
