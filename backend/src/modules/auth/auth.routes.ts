import { Router } from 'express';
import {
  handleGoogleAuth,
  handleRegister,
  handleLogin,
  handleRefreshToken,
  handleGetMe,
  handleLogout,
} from './auth.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

// Public routes (no auth required)
router.post('/google', handleGoogleAuth);
router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/refresh', handleRefreshToken);

// Protected routes (require valid JWT)
router.get('/me', authenticate, handleGetMe);
router.post('/logout', authenticate, handleLogout);

export default router;
