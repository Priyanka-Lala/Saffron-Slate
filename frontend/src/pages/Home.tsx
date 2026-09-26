import { useState, useEffect } from 'react';
import type { Recipe, NavigateFn } from '../data';
import * as recipesApi from '../api/recipes';
import { getImageUrl } from '../api/client';
import RecipeCard from '../components/RecipeCard';
import { ClockIcon, StarIcon, FireIcon } from '../components/Icons';

interface HomeProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

export default function Home({ favorites, onToggleFavorite, navigate }: HomeProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    recipesApi
      .listRecipes({ sort: 'Newest' })
      .then(setRecipes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load recipes.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading recipes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-charcoal font-semibold">No recipes yet</p>
        <p className="text-muted text-sm">Be the first to add one!</p>
      </div>
    );
  }

  const hero = recipes[0];
  const recommended = recipes.slice(1);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 py-10">

        {/* Hero section */}
        <div className="mb-3">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Featured Recipe</p>
          <h2 className="font-serif text-3xl font-bold text-charcoal">Today&apos;s Spotlight</h2>
        </div>

        <div
          className="relative rounded-[22px] overflow-hidden bg-charcoal mb-14 cursor-pointer group shadow-lg"
          style={{ minHeight: 420 }}
          onClick={() => navigate('recipe-detail', hero.id)}
        >
          {/* Background image */}
          <img
            src={getImageUrl(hero.image)}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-10 max-w-xl" style={{ minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hero.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-gold text-charcoal px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-4">
              {hero.title}
            </h1>

            {/* Description */}
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-md line-clamp-2">
              {hero.description}
            </p>

            {/* Meta stats */}
            <div className="flex items-center gap-6 mb-7">
              <div className="flex items-center gap-1.5 text-white/80">
                <ClockIcon className="w-4 h-4 text-gold" />
                <span className="text-sm">{hero.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">{hero.servings} servings</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <FireIcon className="w-4 h-4 text-gold" />
                <span className="text-sm">{hero.calories} kcal</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <StarIcon className="w-4 h-4 text-gold" />
                <span className="text-sm">{hero.rating} ({hero.ratingCount} reviews)</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <button
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-7 py-3 rounded-full transition-colors shadow-md text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('recipe-detail', hero.id);
                }}
              >
                View Full Recipe
              </button>
            </div>
          </div>
        </div>

        {/* Recommended section */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Curated For You</p>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Recommended Recipes</h2>
          </div>
          <button
            onClick={() => navigate('recipes')}
            className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors underline underline-offset-2"
          >
            Browse All →
          </button>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {recommended.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorited={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
