import type { Recipe, NavigateFn } from '../data';
import { getImageUrl } from '../api/client';
import { HeartIcon, StarIcon, ClockIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

export default function RecipeCard({ recipe, isFavorited, onToggleFavorite, navigate }: RecipeCardProps) {
  return (
    <div className="bg-card rounded-[18px] overflow-hidden shadow-sm border border-warm-border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer">
      {/* Image */}
      <div
        className="relative aspect-video overflow-hidden bg-cream-dark"
        onClick={() => navigate('recipe-detail', recipe.id)}
      >
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
            isFavorited
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 text-muted hover:bg-white hover:text-red-400'
          }`}
        >
          <HeartIcon className="w-4 h-4" filled={isFavorited} />
        </button>
        {/* Difficulty badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              recipe.difficulty === 'Easy'
                ? 'bg-green-100 text-green-700'
                : recipe.difficulty === 'Medium'
                ? 'bg-gold-light text-gold-dark'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => navigate('recipe-detail', recipe.id)}
      >
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <StarIcon className="w-3.5 h-3.5 text-gold" filled />
          <span className="text-xs font-semibold text-charcoal-mid">{recipe.rating.toFixed(1)}</span>
          <span className="text-xs text-muted">({recipe.ratingCount})</span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-semibold text-[0.95rem] text-charcoal leading-snug mb-3 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted">
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="text-xs">{recipe.time}</span>
          </div>
          <span className="text-xs font-medium text-gold bg-gold-light px-2.5 py-0.5 rounded-full">
            {recipe.cuisine}
          </span>
        </div>
      </div>
    </div>
  );
}
