import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import * as certificateController from './certificate.controller.js';

const router = Router();

// Get semua sertifikat milik user yang login
router.get('/', authenticate, certificateController.getMyCertificates);

// Download PDF sertifikat
router.get('/:id/download', authenticate, certificateController.downloadCertificate);

export default router;
