import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import * as registrationController from './registration.controller.js';

const router = Router();

// Endpoint list pendaftaran untuk event (panitia) dan my registrations (relawan)
router.get('/', authenticate, registrationController.getEventRegistrations);
router.get('/me', authenticate, registrationController.getMyRegistrations);

// Endpoint update status (panitia & admin)
router.patch(
  '/:id',
  authenticate,
  authorize(['panitia', 'admin']),
  registrationController.updateRegistrationStatus
);

// Note: Endpoint POST /api/events/:id/registrations akan didefinisikan di event.routes.ts
// atau di app.ts dengan path /api/events/:id/registrations
export default router;
