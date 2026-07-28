import { Router } from 'express';
import {
  handleCreate,
  handleGetAll,
  handleGetById,
  handleUpdate,
  handleUpdateStatus,
  handleDelete,
} from './event.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { upload } from '../../utils/upload.js';

const router = Router();

// Public routes
router.get('/', handleGetAll);
router.get('/:id', handleGetById);

// Protected routes (admin/panitia only)
router.use(authenticate);
router.use(authorize(['admin', 'panitia']));

router.post('/', upload.single('gambar'), handleCreate);
router.put('/:id', upload.single('gambar'), handleUpdate);
router.patch('/:id/status', handleUpdateStatus);
router.delete('/:id', handleDelete);

export default router;
