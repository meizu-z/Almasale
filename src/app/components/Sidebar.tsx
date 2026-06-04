import { LayoutDashboard, ShoppingCart, Users, Package, BarChart3, FileText, Settings, LogOut } from 'lucide-react';
import watermarkLogo from '../../imports/Watermark.png';

export type Page = 'dashboard' | 'pos' | 'utang' | 'inventory' | 'analytics' | 'reports' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOnline: boolean;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
  { id: 'utang', label: 'Utang CRM', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar({ currentPage, onNavigate, isOnline }: SidebarProps) {
  return (
    <aside
      className="w-[228px] flex flex-col h-full shrink-0"
      style={{ background: '#000000', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={watermarkLogo}
            alt="AlmaSale logo"
            className="w-12 h-12 object-contain shrink-0"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.55))' }}
          />
          <div className="leading-tight">
            <div style={{ color: '#F8FAFC', fontWeight: 900, fontSize: 21, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              AlmaSale
            </div>
            <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
              Micro-Merchant OS
            </div>
          </div>
        </div>
      </div>

      {/* Store Info Card */}
      <div className="mx-4 mb-5 p-3.5 rounded-2xl border border-white/5" style={{ background: '#121212' }}>
        <div style={{ color: '#94A3B8', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Active Store
        </div>
        <div style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 700, marginTop: 3 }}>
          Santos General Store
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isOnline ? '#10B981' : '#F59E0B',
              boxShadow: isOnline ? '0 0 6px #10B981' : '0 0 6px #F59E0B',
            }}
          />
          <span style={{ color: isOnline ? '#10B981' : '#F59E0B', fontSize: 11, fontWeight: 600 }}>
            {isOnline ? 'Online' : 'Offline Mode Active'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <div style={{ color: '#94A3B8', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 12px 8px' }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id as Page)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
              style={{
                background: active ? '#1800ad' : 'transparent',
                color: active ? '#ffffff' : '#94A3B8',
                boxShadow: active ? '0 4px 20px rgba(24,0,173,0.4)' : 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = '#F8FAFC';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{label}</span>
              {id === 'pos' && (
                <span
                  className="ml-auto rounded-full px-2 py-0.5"
                  style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(24,0,173,0.25)', color: active ? '#fff' : '#818cf8', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' }}
                >
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: Logout + Footer */}
      <div className="px-3 pb-4 mt-2">
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ color: '#94A3B8', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#bf0404';
            (e.currentTarget as HTMLElement).style.background = 'rgba(191,4,4,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#94A3B8';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <LogOut size={16} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>
        </button>

        {/* Footer credit */}
        <div className="mt-3 text-center" style={{ color: '#94A3B8', fontSize: 10, opacity: 0.5, letterSpacing: '0.03em' }}>
          Developed by Metchy Tunacao
        </div>
      </div>
    </aside>
  );
}
