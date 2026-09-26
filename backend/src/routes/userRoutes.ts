import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  changePassword,
  updateMySettings,
  deleteMyAccount,
} from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);
router.post('/me/avatar', requireAuth, upload.single('avatar'), updateMyAvatar);
router.put('/me/password', requireAuth, changePassword);
router.put('/me/settings', requireAuth, updateMySettings);
router.delete('/me', requireAuth, deleteMyAccount);

export default router;
