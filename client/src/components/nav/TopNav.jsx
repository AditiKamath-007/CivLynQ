import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import './TopNav.css';

export default function TopNav({ collapsed = false, progress, onBack }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCollapsed = collapsed || location.pathname.startsWith('/roadmap/questions');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/schemes', label: 'Schemes' },
    { to: '/ai', label: 'AI' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav
      className={`top-nav ${scrolled ? 'top-nav-scrolled' : ''} ${
        isCollapsed ? 'top-nav-collapsed' : 'top-nav-sidebar'
      }`}
    >
      {isCollapsed ? (
        <div className="top-nav-inner-collapsed">
          <button
            className="top-nav-back"
            onClick={onBack || (() => navigate(-1))}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          {progress != null && (
            <div className="top-nav-progress">
              <ProgressBar value={progress.current} max={progress.total} />
            </div>
          )}
        </div>
      ) : (
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <Link to="/" className="sidebar-wordmark">
              CIVLYNQ
            </Link>
          </div>
          
          <div className="sidebar-action">
            <Button
              variant="primary"
              className="sidebar-new-btn"
              icon={Plus}
              onClick={() => navigate('/')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              New
            </Button>
          </div>

          <div className="sidebar-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
