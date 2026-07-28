import { Router } from 'express';
import {
  handleCreate,
  handleGetAll,
  handleGetById,
  handleUpdate,
  handleDelete,
} from './organization.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { upload } from '../../utils/upload.js';

const router = Router();

// Public routes
router.get('/', handleGetAll);
router.get('/:id', handleGetById);

// Protected routes (admin/panitia only)
// Note: Based on CODING_AGENT.md, managing organizations is for admins. 
// We will allow 'admin' and 'panitia' for now. Or just 'admin'. Let's allow 'admin'.
router.use(authenticate);
router.use(authorize(['admin']));

router.post('/', upload.single('logo'), handleCreate);
router.put('/:id', upload.single('logo'), handleUpdate);
router.delete('/:id', handleDelete);

export default router;
