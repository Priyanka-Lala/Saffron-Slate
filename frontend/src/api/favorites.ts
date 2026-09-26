import { apiFetch } from './client';
import type { Recipe } from '../data';

export async function listFavorites(): Promise<Recipe[]> {
  const { recipes } = await apiFetch<{ recipes: Recipe[] }>('/api/favorites');
  return recipes;
}

/** Toggles a recipe's favorited status and returns the full updated list of favorited recipe IDs. */
export async function toggleFavorite(recipeId: string): Promise<string[]> {
  const { favorites } = await apiFetch<{ favorites: string[] }>(`/api/favorites/${recipeId}/toggle`, {
    method: 'POST',
  });
  return favorites;
}
