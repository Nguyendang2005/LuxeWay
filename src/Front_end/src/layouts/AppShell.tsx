import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUIStore } from '@/store';

interface AppShellProps {
  /** Sidebar content (nav links, logo, user info, etc.) */
  sidebar: React.ReactNode;
  /** Override sidebar width (default 260px) */
  sidebarWidth?: number;
  /** Theme class applied on outermost wrapper (e.g. 'theme-owner') */
  themeClass?: string;
  /** Children OR use <Outlet /> if wrapping routes */
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({
  sidebar,
  sidebarWidth = 260,
  themeClass = '',
  children,
}) => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Automatically close sidebar when navigating to a new route on mobile/tablet viewports
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <div
      className={`app-shell ${themeClass}`}
      style={{
        minHeight: '100vh',
        background: 'var(--lw-bg-primary, #F8F7F4)',
        // Define sidebar width dynamically via CSS variable to let CSS media queries handle it cleanly
        ['--lw-sidebar-width' as any]: `${sidebarWidth}px`,
      }}
    >
      {/* ── BACKDROP OVERLAY ──
          Displays on screens < 1024px when the sidebar is toggled open.
          Clicking the overlay automatically closes the sidebar drawer.
      */}
      {sidebarOpen && (
        <div
          className="app-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR TOGGLE BUTTON ──
          Floating toggle button displayed in the lower-right or upper-left corner on mobile viewports.
      */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="app-sidebar-toggle-btn"
        aria-label="Toggle Sidebar Menu"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── SIDEBAR ──
          Positioned below the global navbar. Responsive classes in globals.css
          handle slide-in drawer on mobile.
      */}
      <aside
        className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        style={{
          background: 'var(--lw-sidebar-bg, #ffffff)',
          borderRight: '1px solid var(--lw-border, #e5e7eb)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 transparent',
        }}
      >
        {sidebar}
      </aside>

      {/* ── MAIN CONTENT ──
          Offset from left by sidebar width on desktop, full-width on mobile.
      */}
      <main
        className="app-main"
        style={{
          background: 'var(--lw-bg-primary, #F8F7F4)',
          boxSizing: 'border-box',
        }}
      >
        <div className="app-main-inner">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AppShell;

