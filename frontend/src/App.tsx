import { useState, useEffect, useCallback } from 'react';
import type { Page } from './data';
import { AuthProvider, useAuth } from './context/AuthContext';
import * as favoritesApi from './api/favorites';
import GlobalNav from './components/GlobalNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';

const AUTH_PAGES: Page[] = ['login', 'signup', 'forgot-password'];
const PAGES_WITH_FOOTER: Page[] = ['home', 'recipes', 'recipe-detail', 'favorites', 'profile'];
// Pages that require the person to be logged in. If they land here
// without a session, we bounce them to Login instead of showing a
// broken/empty page.
const PROTECTED_PAGES: Page[] = ['favorites', 'add-recipe', 'profile', 'edit-profile', 'settings'];

function AppShell() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [recipeId, setRecipeId] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const navigate = (target: Page, id?: string) => {
    if (PROTECTED_PAGES.includes(target) && !isAuthenticated) {
      setPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setPage(target);
    if (id) setRecipeId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load the logged-in user's favorited recipe IDs once we know they're authenticated.
  // Everything else (Home, Recipes, Favorites, RecipeDetail cards) just needs this
  // id list to know which hearts to fill in.
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    favoritesApi
      .listFavorites()
      .then((recipes) => setFavorites(recipes.map((r) => r.id)))
      .catch(() => {
        /* Non-fatal — the page will just show hearts as unfilled until this succeeds. */
      });
  }, [isAuthenticated]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        navigate('login');
        return;
      }
      // Optimistic update so the heart icon responds instantly.
      setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
      try {
        const updated = await favoritesApi.toggleFavorite(id);
        setFavorites(updated);
      } catch {
        // Revert on failure by re-syncing with the server's real state.
        favoritesApi.listFavorites().then((recipes) => setFavorites(recipes.map((r) => r.id)));
      }
    },
    [isAuthenticated]
  );

  // While we're checking for an existing session (page refresh), avoid a flash of the wrong UI.
  if (authLoading) {
    return <div className="min-h-screen bg-cream" />;
  }

  // Auth-only layout (no nav)
  if (AUTH_PAGES.includes(page)) {
    return (
      <>
        {page === 'login' && <Login navigate={navigate} />}
        {page === 'signup' && <SignUp navigate={navigate} />}
        {page === 'forgot-password' && <ForgotPassword navigate={navigate} />}
      </>
    );
  }

  const showFooter = PAGES_WITH_FOOTER.includes(page);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <GlobalNav currentPage={page} navigate={navigate} />

      <main className="flex-1">
        {page === 'home' && (
          <Home favorites={favorites} onToggleFavorite={toggleFavorite} navigate={navigate} />
        )}
        {page === 'recipes' && (
          <Recipes favorites={favorites} onToggleFavorite={toggleFavorite} navigate={navigate} />
        )}
        {page === 'recipe-detail' && (
          <RecipeDetail
            recipeId={recipeId}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            navigate={navigate}
          />
        )}
        {page === 'favorites' && (
          <Favorites favorites={favorites} onToggleFavorite={toggleFavorite} navigate={navigate} />
        )}
        {page === 'add-recipe' && <AddRecipe navigate={navigate} />}
        {page === 'profile' && (
          <Profile favorites={favorites} onToggleFavorite={toggleFavorite} navigate={navigate} />
        )}
        {page === 'edit-profile' && <EditProfile navigate={navigate} />}
        {page === 'settings' && <Settings navigate={navigate} />}
      </main>

      {showFooter && <Footer navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
