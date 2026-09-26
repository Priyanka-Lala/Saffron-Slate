import { useState, useEffect } from 'react';
import type { Recipe, NavigateFn } from '../data';
import { useAuth } from '../context/AuthContext';
import * as usersApi from '../api/users';
import * as recipesApi from '../api/recipes';
import * as favoritesApi from '../api/favorites';
import { getImageUrl } from '../api/client';
import RecipeCard from '../components/RecipeCard';
import { MapPinIcon, EditIcon } from '../components/Icons';

interface ProfileProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  navigate: NavigateFn;
}

type Tab = 'recipes' | 'collections' | 'activity';

export default function Profile({ favorites, onToggleFavorite, navigate }: ProfileProps) {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const [profile, setProfile] = useState(authUser);
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersApi.getMyProfile(), recipesApi.listMyRecipes(), favoritesApi.listFavorites()])
      .then(([profileData, myRecipesData, savedRecipesData]) => {
        setProfile(profileData);
        setMyRecipes(myRecipesData);
        setSavedRecipes(savedRecipesData);
      })
      .finally(() => setIsLoading(false));
  }, [favorites]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 py-10">
        {/* Profile header card */}
        <div className="bg-card rounded-2xl border border-warm-border p-8 mb-8">
          <div className="flex items-start gap-7">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={getImageUrl(profile.avatar)}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-warm-border"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full border-2 border-card flex items-center justify-center">
                <svg className="w-3 h-3 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-charcoal">{profile.name}</h1>
                  <p className="text-muted text-sm mt-0.5">@{profile.username}</p>
                </div>
                <button
                  onClick={() => navigate('edit-profile')}
                  className="flex items-center gap-2 border border-warm-border text-charcoal-mid hover:border-gold hover:text-gold text-sm font-semibold px-4 py-2 rounded-full transition-all"
                >
                  <EditIcon className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>

              {profile.location && (
                <div className="flex items-center gap-1.5 text-muted text-sm mt-2">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
              )}

              <p className="text-charcoal-mid text-sm mt-3 leading-relaxed max-w-xl">{profile.bio}</p>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-5 pt-5 border-t border-warm-border">
                <div className="text-center">
                  <p className="font-serif font-bold text-2xl text-charcoal">{profile.recipeCount}</p>
                  <p className="text-xs text-muted mt-0.5">Recipes</p>
                </div>
                <div className="w-px h-8 bg-warm-border" />
                <div className="text-center">
                  <p className="font-serif font-bold text-2xl text-charcoal">{profile.followers.toLocaleString()}</p>
                  <p className="text-xs text-muted mt-0.5">Followers</p>
                </div>
                <div className="w-px h-8 bg-warm-border" />
                <div className="text-center">
                  <p className="font-serif font-bold text-2xl text-charcoal">{profile.following}</p>
                  <p className="text-xs text-muted mt-0.5">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-7 border-b border-warm-border">
          {([
            { id: 'recipes', label: 'Your Recipes' },
            { id: 'collections', label: 'Saved Collections' },
            { id: 'activity', label: 'Activity' },
          ] as { id: Tab; label: string }[]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                activeTab === id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted hover:text-charcoal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'recipes' && (
          myRecipes.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">You haven't published any recipes yet</h3>
              <p className="text-muted text-sm max-w-xs mb-5">Share your first creation with the community.</p>
              <button
                onClick={() => navigate('add-recipe')}
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
              >
                Add a Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-5">
              {myRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorited={favorites.includes(recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                  navigate={navigate}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'collections' && (
          <div>
            {savedRecipes.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">No saved collections yet</h3>
                <p className="text-muted text-sm max-w-xs mb-5">Save recipes to create your first collection.</p>
                <button onClick={() => navigate('recipes')} className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-6 py-2.5 rounded-full transition-colors">
                  Browse Recipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-5">
                {savedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} isFavorited={favorites.includes(recipe.id)} onToggleFavorite={onToggleFavorite} navigate={navigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          /* NOTE: there's no activity-log backend yet — see README "Not built yet".
             Showing an honest empty state here rather than fabricated history. */
          <div className="flex flex-col items-center py-20 text-center">
            <h3 className="font-serif text-lg font-semibold text-charcoal mb-2">Activity feed coming soon</h3>
            <p className="text-muted text-sm max-w-sm">
              We'll show a timeline of your publishes, saves, and ratings here in a future update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
