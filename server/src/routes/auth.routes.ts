import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.put('/update-password', authenticateToken, authController.updatePassword.bind(authController));
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export { router as authRoutes };
