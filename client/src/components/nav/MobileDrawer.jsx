import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Sparkles, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/schemes', label: 'Schemes', icon: LayoutGrid },
  { path: '/ai', label: 'AI', icon: Sparkles },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 w-[240px] bg-brand-green dark:bg-brand-green-dark flex flex-col md:hidden shadow-xl"
          >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-5 mt-2 mb-4">
              <div className="text-white font-display font-extrabold text-2xl tracking-wide">
                CIVLYNQ
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`relative h-12 flex items-center gap-4 px-4 rounded-lg mx-3 my-1 transition-all duration-200 overflow-hidden ${
                      isActive 
                        ? 'bg-brand-orange shadow-pop' 
                        : 'hover:bg-brand-green-lt dark:hover:bg-brand-green-lt-dark'
                    }`}
                  >
                    <Icon 
                      size={24} 
                      className={isActive ? 'text-white' : 'text-white/70'} 
                      aria-hidden="true" 
                    />
                    <span className={`font-sans text-[16px] whitespace-nowrap transition-colors ${
                      isActive ? 'text-white font-semibold' : 'text-white/85 font-medium'
                    }`}>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto mb-6 px-3">
              <div className="h-px bg-white/15" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
