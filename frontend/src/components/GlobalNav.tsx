import { useState } from 'react';
import type { Page, NavigateFn } from '../data';
import { ForkKnifeIcon, SearchIcon, BellIcon, SettingsIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/client';

interface GlobalNavProps {
  currentPage: Page;
  navigate: NavigateFn;
}

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Recipes', page: 'recipes' },
  { label: 'Favorites', page: 'favorites' },
];

export default function GlobalNav({ currentPage, navigate }: GlobalNavProps) {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('recipes');
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-warm-border shadow-sm">
      <div className="max-w-[1280px] mx-auto px-8 h-[70px] flex items-center gap-6">
        {/* Wordmark */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 shrink-0 text-charcoal hover:text-gold transition-colors"
        >
          <ForkKnifeIcon className="w-5 h-5 text-gold" />
          <span className="font-serif font-bold text-[1.15rem] text-charcoal leading-tight">
            Saffron & Slate
          </span>
        </button>

        {/* Nav links */}
        <nav className="flex items-center gap-1 ml-4">
          {NAV_LINKS.map(({ label, page }) => {
            const active = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-gold-light text-gold font-semibold'
                    : 'text-muted hover:text-charcoal-mid hover:bg-cream-dark'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="pl-9 pr-4 py-2 rounded-full bg-cream border border-warm-border text-sm w-44 focus:outline-none focus:border-gold focus:w-56 transition-all text-charcoal-mid placeholder:text-muted"
          />
        </form>

        {isAuthenticated && user ? (
          <>
            {/* Bell */}
            <button className="relative p-2 text-muted hover:text-charcoal transition-colors rounded-full hover:bg-cream-dark">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full border border-card" />
            </button>

            {/* Settings */}
            <button
              onClick={() => navigate('settings')}
              className="p-2 text-muted hover:text-charcoal transition-colors rounded-full hover:bg-cream-dark"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <button
              onClick={() => navigate('profile')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-warm-border hover:border-gold transition-all shrink-0"
            >
              <img
                src={getImageUrl(user.avatar)}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>

            {/* Add Recipe CTA */}
            <button
              onClick={() => navigate('add-recipe')}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
            >
              + Add Recipe
            </button>
          </>
        ) : (
          <>
            {/* Logged-out state */}
            <button
              onClick={() => navigate('login')}
              className="text-sm font-semibold text-charcoal-mid hover:text-charcoal transition-colors px-3 py-2 shrink-0"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('signup')}
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0 shadow-sm"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
