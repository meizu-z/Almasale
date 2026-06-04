import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { WifiOff, FileText, Settings, BarChart3 } from 'lucide-react';
import { Page } from './components/Sidebar';
import { AppShell } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { POSView } from './components/POSView';
import { UtangCRM } from './components/UtangCRM';
import { Inventory } from './components/Inventory';
import { Analytics } from './components/Analytics';

const BG = '#000000';
const CARD = '#121212';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';

function ReportsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-4 sm:p-8 overflow-y-auto" style={{ background: BG }}>
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)' }}>
        <FileText size={36} color={MUTED} />
      </div>
      <div className="text-center">
        <h2 style={{ color: TEXT, fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>Reports</h2>
        <p style={{ color: MUTED, fontSize: 14, marginTop: 6, maxWidth: 360 }}>
          I-download ang monthly reports, tax documents, at sales summaries para sa inyong negosyo.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
        {['Monthly Sales Report', 'Utang Ledger Export', 'Inventory Snapshot', 'BIR Summary'].map(r => (
          <button
            key={r}
            className="p-5 rounded-3xl text-left transition-colors"
            style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(24,0,173,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'}
          >
            <BarChart3 size={18} color="#1800ad" />
            <div style={{ color: TEXT, fontSize: 13, fontWeight: 700, marginTop: 10 }}>{r}</div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 3 }}>Download as PDF</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="h-full flex flex-col p-4 sm:p-8 gap-5 overflow-y-auto" style={{ background: BG, scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
      <div>
        <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Settings</h2>
        <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>I-configure ang iyong AlmaSale account at store preferences.</p>
      </div>
      {[
        { section: 'Store Information', items: ['Store Name', 'Store Address', 'Owner Name', 'Contact Number'] },
        { section: 'Credit & Utang Policy', items: ['Default Credit Limit', 'Tiwala Score Thresholds', 'SMS Reminders', 'Auto Risk Escalation'] },
        { section: 'POS Configuration', items: ['Default Customer', 'Receipt Format', 'Tax Rate (VAT)', 'Printer Settings'] },
        { section: 'Account & Security', items: ['Change Password', 'Two-Factor Authentication', 'Session Timeout', 'Audit Logs'] },
      ].map(({ section, items }) => (
        <div key={section} className="rounded-3xl p-6" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <h3 style={{ color: TEXT, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{section}</h3>
          <div className="space-y-1.5">
            {items.map(item => (
              <button
                key={item}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors text-left"
                style={{ background: '#0a0a0a' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#111'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#0a0a0a'}
              >
                <span style={{ color: TEXT, fontSize: 13 }}>{item}</span>
                <Settings size={13} color={MUTED} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden" style={{ background: BG }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#121212', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 },
        }}
      />

      {/* Offline badge */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-full"
            style={{ background: '#F59E0B', color: '#000', boxShadow: '0 8px 32px rgba(245,158,11,0.45)', fontWeight: 700, fontSize: 12 }}
          >
            <WifiOff size={14} />
            Offline Mode Active — Transactions will sync when reconnected
          </motion.div>
        )}
      </AnimatePresence>

      <AppShell page={page} onNavigate={setPage} isOnline={isOnline}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {page === 'dashboard' && <Dashboard />}
            {page === 'pos' && <POSView onBack={() => setPage('dashboard')} isOnline={isOnline} />}
            {page === 'utang' && <UtangCRM />}
            {page === 'inventory' && <Inventory />}
            {page === 'analytics' && <Analytics />}
            {page === 'reports' && <ReportsPage />}
            {page === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </div>
  );
}
