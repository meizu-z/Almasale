import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import watermarkLogo from '../../imports/Watermark.png';
import { Sidebar, Page } from './Sidebar';
import { useIsMobile } from './ui/use-mobile';

interface AppShellProps {
  page: Page;
  onNavigate: (page: Page) => void;
  isOnline: boolean;
  /** POS runs full-screen with no sidebar/top bar chrome. */
  showSidebar: boolean;
  children: React.ReactNode;
}

/**
 * Owns the responsive navigation chrome:
 *  - md+ : static 228px sidebar rail (unchanged desktop layout)
 *  - <md : sidebar collapses to an off-canvas drawer opened from a mobile top bar
 * POS (showSidebar=false) renders children full-screen with no chrome.
 */
export function AppShell({ page, onNavigate, isOnline, showSidebar, children }: AppShellProps) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-close the drawer when the viewport grows back to desktop.
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // Lock body scroll while the drawer overlay is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [drawerOpen]);

  const handleNavigate = (p: Page) => {
    onNavigate(p);
    setDrawerOpen(false);
  };

  // POS: full screen, no nav chrome.
  if (!showSidebar) return <>{children}</>;

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* Desktop static sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar currentPage={page} onNavigate={handleNavigate} isOnline={isOnline} />
      </div>

      {/* Mobile drawer backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Mobile off-canvas drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full md:hidden transition-transform duration-200 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar currentPage={page} onNavigate={handleNavigate} isOnline={isOnline} />
      </div>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
        {/* Mobile top bar */}
        <div
          className="md:hidden shrink-0 flex items-center gap-3 px-4 h-14"
          style={{ background: '#000000', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl"
            style={{ background: 'transparent' }}
          >
            <Menu size={22} color="#F8FAFC" />
          </button>
          <img
            src={watermarkLogo}
            alt=""
            className="w-8 h-8 object-contain shrink-0"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.55))' }}
          />
          <span style={{ color: '#F8FAFC', fontWeight: 900, fontSize: 16, letterSpacing: '-0.02em' }}>
            AlmaSale
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isOnline ? '#10B981' : '#F59E0B',
                boxShadow: isOnline ? '0 0 6px #10B981' : '0 0 6px #F59E0B',
              }}
            />
            <span style={{ color: isOnline ? '#10B981' : '#F59E0B', fontSize: 11, fontWeight: 600 }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <main className="flex-1 min-h-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
