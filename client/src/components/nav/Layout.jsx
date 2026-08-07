import { Outlet, useLocation } from 'react-router-dom';
import TopNav from './TopNav';
import BottomTabNav from './BottomTabNav';
import './Layout.css';

export default function Layout() {
  const location = useLocation();

  // Pages where nav should be collapsed (back arrow + progress)
  const isRoadmapFlow =
    location.pathname.startsWith('/roadmap/questions') ||
    location.pathname.startsWith('/roadmap/');

  // Pages where we hide all nav (login)
  const isFullscreen = location.pathname === '/login';

  if (isFullscreen) {
    return <Outlet />;
  }

  return (
    <>
      <TopNav collapsed={isRoadmapFlow} />
      <main className={`layout-content ${!isRoadmapFlow ? 'sidebar-active' : ''}`}>
        <Outlet />
      </main>
      <BottomTabNav />
    </>
  );
}
