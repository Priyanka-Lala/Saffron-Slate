import { useState, useEffect } from 'react';
import type { Recipe, NavigateFn } from '../data';
import * as recipesApi from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import { SearchIcon, ChevronDownIcon } from '../components/Icons';

interface RecipesProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

const CATEGORIES = ['All', 'Main Course', 'Breakfast', 'Dessert', 'Baking', 'Salad', 'Soup'];
const CUISINES = ['All', 'Italian', 'Thai', 'French', 'Asian', 'Middle Eastern', 'Modern', 'Fusion'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const SORT_OPTIONS = ['Most Popular', 'Newest', 'Quickest', 'Highest Rated'];

export default function Recipes({ favorites, onToggleFavorite, navigate }: RecipesProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cuisine, setCuisine] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('Most Popular');
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Re-fetch from the backend whenever a filter changes — the search/
  // category/cuisine/difficulty/sort logic all lives server-side now
  // (see recipeController.ts), so this stays in sync with what other
  // users' newly-published recipes look like too.
  useEffect(() => {
    setIsLoading(true);
    // Small debounce on typed search so we're not firing a request per keystroke.
    const timeout = setTimeout(() => {
      recipesApi
        .listRecipes({ search, category, cuisine, difficulty, sort })
        .then(setFiltered)
        .catch(() => setFiltered([]))
        .finally(() => setIsLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, category, cuisine, difficulty, sort]);

  const hasFilters = category !== 'All' || cuisine !== 'All' || difficulty !== 'All' || search;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-1">Explore</p>
          <h1 className="font-serif text-3xl font-bold text-charcoal">All Recipes</h1>
          <p className="text-muted text-sm mt-1">{filtered.length} recipes and counting — find your next favourite.</p>
        </div>

        {/* Filters bar */}
        <div className="bg-card rounded-2xl border border-warm-border p-5 mb-8 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes, ingredients, tags..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream border border-warm-border text-sm focus:outline-none focus:border-gold text-charcoal-mid placeholder:text-muted"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-cream border border-warm-border text-sm text-charcoal-mid focus:outline-none focus:border-gold cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Cuisine */}
          <div className="relative">
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-cream border border-warm-border text-sm text-charcoal-mid focus:outline-none focus:border-gold cursor-pointer"
            >
              {CUISINES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Difficulty */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-cream border border-warm-border text-sm text-charcoal-mid focus:outline-none focus:border-gold cursor-pointer"
            >
              {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-cream border border-warm-border text-sm text-charcoal-mid focus:outline-none focus:border-gold cursor-pointer"
            >
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setCategory('All'); setCuisine('All'); setDifficulty('All'); }}
              className="text-xs font-semibold text-muted hover:text-charcoal border border-warm-border px-3 py-2.5 rounded-xl transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          {search || hasFilters ? (
            <p className="text-sm text-muted">
              <span className="font-semibold text-charcoal-mid">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
              {search && <span> for &ldquo;<span className="font-semibold text-charcoal">{search}</span>&rdquo;</span>}
            </p>
          ) : (
            <p className="text-sm text-muted">Showing all <span className="font-semibold text-charcoal-mid">{filtered.length}</span> recipes</p>
          )}
        </div>

        {/* Grid, loading, or empty state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-muted text-sm">Loading recipes…</p>
          </div>
        ) : filtered.length > 0 ? (
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
        ) : (
          /* No results state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
              <SearchIcon className="w-7 h-7 text-muted" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">No recipes found</h3>
            <p className="text-muted text-sm max-w-sm mb-6">
              We couldn&apos;t find anything matching your filters. Try broadening your search or clearing the filters.
            </p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setCuisine('All'); setDifficulty('All'); }}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
