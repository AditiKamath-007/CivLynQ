import { NavLink } from 'react-router-dom';
import { MessageCircle, FileText, Home, LayoutGrid, User } from 'lucide-react';
import '../../styles/_legacy/BottomTabNav.css';

const tabs = [
  { to: '/ai', icon: MessageCircle, label: 'AI' },
  { to: '/schemes', icon: FileText, label: 'Schemes' },
  { to: '/', icon: Home, label: 'Home', center: true },
  { to: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomTabNav() {
  return (
    <nav className="bottom-tab-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `tab-item ${isActive ? 'tab-item-active' : ''} ${tab.center ? 'tab-item-center' : ''}`
          }
        >
          <tab.icon className="tab-icon" />
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
