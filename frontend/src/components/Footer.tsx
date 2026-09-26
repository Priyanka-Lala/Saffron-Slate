import type { NavigateFn } from '../data';
import { ForkKnifeIcon } from './Icons';

interface FooterProps {
  navigate: NavigateFn;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="border-t border-warm-border bg-card mt-20">
      <div className="max-w-[1280px] mx-auto px-8 py-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-charcoal">
          <ForkKnifeIcon className="w-4 h-4 text-gold" />
          <span className="font-serif font-bold text-base">Saffron & Slate</span>
          <span className="text-muted text-sm ml-2">— cooking is an act of love.</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <button onClick={() => navigate('home')} className="hover:text-charcoal transition-colors">Home</button>
          <button onClick={() => navigate('recipes')} className="hover:text-charcoal transition-colors">Recipes</button>
          <span className="hover:text-charcoal transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-charcoal transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-charcoal transition-colors cursor-pointer">Contact</span>
        </nav>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Saffron & Slate</p>
      </div>
    </footer>
  );
}
