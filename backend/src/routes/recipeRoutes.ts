import { Router } from 'express';
import {
  listRecipes,
  listMyRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// NOTE: /mine must be registered before /:id, otherwise Express would
// try to treat "mine" as a recipe ID and fail to match the route.
router.get('/mine', requireAuth, listMyRecipes);

router.get('/', listRecipes);
router.get('/:id', getRecipe);
router.post('/', requireAuth, upload.single('image'), createRecipe);
router.put('/:id', requireAuth, upload.single('image'), updateRecipe);
router.delete('/:id', requireAuth, deleteRecipe);

export default router;
