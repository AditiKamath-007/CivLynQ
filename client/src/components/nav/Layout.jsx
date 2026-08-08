import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const isFullscreen = location.pathname === '/login' || location.pathname === '/signup';

  if (isFullscreen) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bone dark:bg-brand-dark transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Nav Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[64px] transition-all duration-[220ms]">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0 relative">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
