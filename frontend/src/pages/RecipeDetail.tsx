import { useState, useEffect } from 'react';
import type { Recipe, NavigateFn } from '../data';
import * as recipesApi from '../api/recipes';
import { getImageUrl } from '../api/client';
import { ClockIcon, StarIcon, HeartIcon, FireIcon, CheckIcon, BookmarkIcon } from '../components/Icons';

interface RecipeDetailProps {
  recipeId: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

export default function RecipeDetail({ recipeId, favorites, onToggleFavorite, navigate }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<Set<number>>(new Set());

  useEffect(() => {
    setIsLoading(true);
    setChecked(new Set());
    recipesApi
      .getRecipe(recipeId)
      .then(setRecipe)
      .catch((err) => setError(err instanceof Error ? err.message : 'Recipe not found.'))
      .finally(() => setIsLoading(false));
  }, [recipeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading recipe…</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-charcoal font-semibold">{error || 'Recipe not found.'}</p>
        <button
          onClick={() => navigate('recipes')}
          className="text-sm font-semibold text-gold hover:text-gold-dark"
        >
          ← Back to Recipes
        </button>
      </div>
    );
  }

  const isFavorited = favorites.includes(recipe.id);

  const toggleIngredient = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero image */}
      <div className="relative h-[480px] overflow-hidden bg-cream-dark">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-8">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => navigate('recipes')} className="hover:text-white transition-colors">Recipes</button>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[200px]">{recipe.title}</span>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {recipe.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold bg-gold text-charcoal px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-4 max-w-3xl">
              {recipe.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-1.5 text-white/80">
                <StarIcon className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold text-white">{recipe.rating}</span>
                <span className="text-sm text-white/70">({recipe.ratingCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <ClockIcon className="w-4 h-4 text-gold" />
                <span className="text-sm">{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <FireIcon className="w-4 h-4 text-gold" />
                <span className="text-sm">{recipe.calories} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        <div className="grid grid-cols-[1fr_360px] gap-10">

          {/* Left: instructions */}
          <div>
            {/* Chef byline */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-warm-border">
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(recipe.chef.avatar)}
                  alt={recipe.chef.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-warm-border"
                />
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">Recipe by</p>
                  <p className="font-semibold text-charcoal text-sm">{recipe.chef.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleFavorite(recipe.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-sm transition-all ${
                    isFavorited
                      ? 'border-red-400 text-red-500 bg-red-50'
                      : 'border-warm-border text-charcoal-mid hover:border-gold hover:text-gold'
                  }`}
                >
                  <HeartIcon className="w-4 h-4" filled={isFavorited} />
                  {isFavorited ? 'Saved' : 'Save Recipe'}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-warm-border text-charcoal-mid hover:border-gold hover:text-gold font-semibold text-sm transition-all">
                  <BookmarkIcon className="w-4 h-4" />
                  Add to Collection
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-charcoal-mid leading-relaxed mb-8 text-[0.9375rem]">{recipe.description}</p>

            {/* Steps */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Method</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <p className="text-charcoal-mid leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: ingredients */}
          <div>
            <div className="bg-card rounded-2xl border border-warm-border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-bold text-charcoal">Ingredients</h2>
                <span className="text-xs text-muted bg-cream-dark px-2.5 py-1 rounded-full">
                  {recipe.servings} servings
                </span>
              </div>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 cursor-pointer group transition-opacity ${
                      checked.has(i) ? 'opacity-40' : 'opacity-100'
                    }`}
                    onClick={() => toggleIngredient(i)}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        checked.has(i)
                          ? 'bg-gold border-gold text-charcoal'
                          : 'border-warm-border group-hover:border-gold'
                      }`}
                    >
                      {checked.has(i) && <CheckIcon className="w-3 h-3" />}
                    </div>
                    <span className="text-sm text-charcoal-mid leading-snug">
                      <span className="font-semibold text-charcoal">{ing.amount}</span>
                      {' '}{ing.item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-warm-border">
                <p className="text-xs text-muted text-center">Tap ingredients to check them off as you cook</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
