import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Sparkles, LayoutDashboard } from 'lucide-react';

const TABS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/schemes', label: 'Schemes', icon: LayoutGrid },
  { path: '/ai', label: 'AI', icon: Sparkles },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-brand-cream-dk flex justify-around items-center z-40 pb-safe">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
                isActive ? 'text-brand-orange' : 'text-brand-ink-mute'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} className={isActive ? 'text-brand-orange' : 'text-brand-ink-mute'} />
                <span className="text-[10px] font-medium font-sans">
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
