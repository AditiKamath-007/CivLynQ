import { Link, useNavigate } from 'react-router-dom';
import { Plus, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Topbar({ onOpenDrawer }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-brand-dark-card border-b border-brand-cream-dk dark:border-brand-dark-border flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-brand-ink dark:text-brand-dark-ink hover:text-brand-orange transition-colors"
          onClick={onOpenDrawer}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link 
          to="/" 
          className="font-display font-extrabold text-xl text-brand-ink dark:text-brand-dark-ink hover:text-brand-orange transition-colors"
        >
          CIVLYNQ
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleTheme}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-pill bg-white dark:bg-brand-dark-card border border-brand-cream-dk dark:border-brand-dark-border text-brand-ink dark:text-brand-dark-ink hover:bg-brand-cream dark:hover:bg-brand-dark-card-hover transition shadow-card flex items-center justify-center"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dk text-white font-semibold font-display text-[15px] px-4 h-10 rounded-pill shadow-card hover:shadow-card-hov transition-all duration-200"
        >
          <Plus size={18} aria-hidden="true" />
          <span className="hidden sm:inline">New Journey</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
}
