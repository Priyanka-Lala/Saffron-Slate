import { Request, Response } from 'express';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

/** GET /api/favorites — the logged-in user's favorited recipes, in full (for the Favorites page grid). */
export async function listFavorites(req: Request, res: Response) {
  const user = await User.findById(req.userId).populate({
    path: 'favorites',
    populate: { path: 'author', select: 'name avatar' },
  });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const recipes = (user.favorites as any[]).map((recipe) => ({
    id: recipe._id.toString(),
    title: recipe.title,
    image: recipe.image,
    time: recipe.time,
    servings: recipe.servings,
    calories: recipe.calories,
    rating: recipe.rating,
    ratingCount: recipe.ratingCount,
    category: recipe.category,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    description: recipe.description,
    chef: { name: recipe.author?.name ?? 'Unknown Chef', avatar: recipe.author?.avatar ?? '' },
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  }));

  return res.json({ recipes });
}

/**
 * POST /api/favorites/:recipeId/toggle
 * Adds the recipe to the user's favorites if it isn't there, removes it if it is.
 * Returns the updated list of favorited recipe IDs (handy for the frontend's
 * `favorites: string[]` state, which just needs the IDs).
 */
export async function toggleFavorite(req: Request, res: Response) {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const alreadyFavorited = user.favorites.some((id) => id.toString() === recipeId);

  if (alreadyFavorited) {
    user.favorites = user.favorites.filter((id) => id.toString() !== recipeId);
  } else {
    user.favorites.push(recipe._id);
  }
  await user.save();

  return res.json({ favorites: user.favorites.map((id) => id.toString()) });
}
