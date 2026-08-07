import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Sparkles, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'framer-motion';
import LogoMark from '../LogoMark';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/schemes', label: 'Schemes', icon: LayoutGrid },
  { path: '/ai', label: 'AI', icon: Sparkles },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-brand-green transition-all duration-[220ms] ease-out ${
        open ? 'w-[220px]' : 'w-[64px]'
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-3 mt-2 mb-4">
        {open ? (
          <div className="flex items-center gap-2 ml-1 overflow-hidden whitespace-nowrap">
            <LogoMark size={32} />
            <span className="text-white font-display font-extrabold text-xl tracking-wide">
              CIVLYNQ
            </span>
          </div>
        ) : (
          <div className="w-[44px] h-[44px] mx-auto rounded-md flex items-center justify-center">
            <LogoMark size={36} />
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavItem 
              key={item.path} 
              item={item} 
              isActive={isActive} 
              open={open} 
            />
          );
        })}
      </nav>

      <div className="mt-auto mb-4">
        <div className="h-px bg-white/15 mx-3" />
      </div>
    </aside>
  );
}

function NavItem({ item, isActive, open }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={`relative h-11 flex items-center gap-3 px-3 rounded-lg mx-2 my-0.5 transition-all duration-200 overflow-hidden ${
        isActive 
          ? 'bg-brand-orange shadow-pop scale-[1.02]' 
          : 'hover:bg-brand-green-lt'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center min-w-[22px]">
        <Icon 
          size={22} 
          className={isActive || isHovered ? 'text-white' : 'text-white/70'} 
          aria-hidden="true" 
        />
      </div>
      
      {open && (
        <span className={`font-sans text-[15px] whitespace-nowrap overflow-hidden transition-colors ${
          isActive ? 'text-white font-semibold' : 'text-white/85 font-medium group-hover:text-white'
        }`}>
          {item.label}
        </span>
      )}

      {/* Underbar Animation */}
      {!isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-brand-orange"
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        />
      )}
    </NavLink>
  );
}
