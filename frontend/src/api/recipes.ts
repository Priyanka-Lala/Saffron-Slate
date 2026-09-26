import { apiFetch } from './client';
import type { Recipe } from '../data';

export interface RecipeFilters {
  search?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  sort?: string;
}

function toQueryString(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'All') params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function listRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  const { recipes } = await apiFetch<{ recipes: Recipe[] }>(`/api/recipes${toQueryString(filters)}`);
  return recipes;
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { recipe } = await apiFetch<{ recipe: Recipe }>(`/api/recipes/${id}`);
  return recipe;
}

export async function listMyRecipes(): Promise<Recipe[]> {
  const { recipes } = await apiFetch<{ recipes: Recipe[] }>('/api/recipes/mine');
  return recipes;
}

export interface NewRecipeInput {
  title: string;
  description: string;
  category: string;
  cuisine: string;
  difficulty: string;
  time: string;
  servings: string;
  calories: string;
  tags: string; // comma-separated
  ingredients: { amount: string; item: string }[];
  steps: string[];
  imageFile?: File | null;
}

export async function createRecipe(input: NewRecipeInput): Promise<Recipe> {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('category', input.category);
  formData.append('cuisine', input.cuisine);
  formData.append('difficulty', input.difficulty);
  formData.append('time', input.time);
  formData.append('servings', input.servings);
  formData.append('calories', input.calories);
  formData.append('tags', input.tags);
  formData.append('ingredients', JSON.stringify(input.ingredients));
  formData.append('steps', JSON.stringify(input.steps));
  if (input.imageFile) formData.append('image', input.imageFile);

  const { recipe } = await apiFetch<{ recipe: Recipe }>('/api/recipes', {
    method: 'POST',
    body: formData,
    isFormData: true,
  });
  return recipe;
}
