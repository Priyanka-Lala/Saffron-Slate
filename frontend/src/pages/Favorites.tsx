import { useState, useEffect } from 'react';
import type { Recipe, NavigateFn } from '../data';
import * as favoritesApi from '../api/favorites';
import RecipeCard from '../components/RecipeCard';
import { HeartIcon, SearchIcon } from '../components/Icons';

interface FavoritesProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

export default function Favorites({ favorites, onToggleFavorite, navigate }: FavoritesProps) {
  const [search, setSearch] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Re-fetch whenever the favorites list changes (e.g. un-hearting a
  // recipe elsewhere in the app) so this page always reflects the
  // current saved set.
  useEffect(() => {
    setIsLoading(true);
    favoritesApi
      .listFavorites()
      .then(setSavedRecipes)
      .catch(() => setSavedRecipes([]))
      .finally(() => setIsLoading(false));
  }, [favorites]);

  const filtered = savedRecipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading your favorites…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Your Library</p>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Saved Recipes</h1>
            <p className="text-muted text-sm mt-1">
              {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {savedRecipes.length > 0 && (
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your favorites..."
                className="pl-9 pr-4 py-2.5 rounded-xl bg-card border border-warm-border text-sm w-56 focus:outline-none focus:border-gold text-charcoal-mid placeholder:text-muted"
              />
            </div>
          )}
        </div>

        {/* Empty state */}
        {savedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mb-5">
              <HeartIcon className="w-9 h-9 text-warm-border" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal mb-2">No saved recipes yet</h3>
            <p className="text-muted text-sm max-w-sm mb-8 leading-relaxed">
              When you find a recipe you love, tap the heart icon to save it here. Your personal cookbook starts with one recipe.
            </p>
            <button
              onClick={() => navigate('recipes')}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold px-7 py-3 rounded-full transition-colors shadow-sm"
            >
              Browse Recipes
            </button>
          </div>
        ) : filtered.length === 0 ? (
          /* No search results */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mb-4">
              <SearchIcon className="w-6 h-6 text-muted" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">No matches found</h3>
            <p className="text-muted text-sm mb-4">No saved recipe matches &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch('')}
              className="text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {filtered.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorited={favorites.includes(recipe.id)}
                onToggleFavorite={onToggleFavorite}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
