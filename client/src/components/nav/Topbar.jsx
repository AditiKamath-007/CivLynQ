import { Link, useNavigate } from 'react-router-dom';
import { Plus, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onOpenDrawer }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-brand-cream-dk flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-brand-ink hover:text-brand-orange transition-colors"
          onClick={onOpenDrawer}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link 
          to="/" 
          className="font-display font-extrabold text-xl text-brand-ink hover:text-brand-orange transition-colors"
        >
          CIVLYNQ
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border border-brand-cream-dk hover:bg-brand-cream text-brand-ink transition-colors"
          aria-label="Toggle Theme"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-brand-ink" />}
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
