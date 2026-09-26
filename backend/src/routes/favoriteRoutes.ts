import { Router } from 'express';
import { listFavorites, toggleFavorite } from '../controllers/favoriteController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listFavorites);
router.post('/:recipeId/toggle', requireAuth, toggleFavorite);

export default router;
