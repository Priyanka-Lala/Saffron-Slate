import { Router } from 'express';
import { signup, login, forgotPassword, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', requireAuth, getMe);

export default router;
