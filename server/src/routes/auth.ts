import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { authenticate } from '@/middlewares/auth';
import { authValidations } from '@/middlewares/validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', authValidations.login, authController.login);
router.post('/register', authValidations.register, authController.register);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/change-password', authenticate, authValidations.changePassword, authController.changePassword);
router.post('/logout', authenticate, authController.logout);
router.get('/verify', authenticate, authController.verifyToken);

export default router;
