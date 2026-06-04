import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Package, Users, Wallet,
  ArrowUpRight, RefreshCw, Clock,
} from 'lucide-react';
import {
  CUSTOMERS, PRODUCTS, RECENT_SALES, DEBT_AGING,
  formatCurrency, RISK_CONFIG, METHOD_CONFIG,
} from './mockData';

/* ─── Shared tokens ─── */
const BG = '#000000';
const CARD = '#121212';
const INNER = '#0a0a0a';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';

const card = {
  background: CARD,
  border: '1px solid rgba(255,255,255,0.05)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
};

/* ─── Count-up hook ─── */
function useCountUp(target: number, duration = 1300) {
  const [count, setCount] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef<number>(0);
  useEffect(() => {
    start.current = null;
    const tick = (ts: number) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

/* ─── Risk badge ─── */
function RiskBadge({ score }: { score: 'good' | 'monitor' | 'high_risk' }) {
  const c = RISK_CONFIG[score];
  return (
    <span className="px-2 py-0.5 rounded-full inline-block" style={{ background: c.bg, color: c.color, fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}

/* ─── Metric Card ─── */
function MetricCard({ label, value, formatted, icon: Icon, color, trend }: {
  label: string; value: number; formatted: string;
  icon: React.ElementType; color: string; trend?: string;
}) {
  const count = useCountUp(value);
  const display = formatted.replace(/[\d,]+/, count.toLocaleString());

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 flex flex-col justify-between h-full"
      style={card}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={16} color={color} />
        </div>
        {trend && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: 10, fontWeight: 700 }}>
            <ArrowUpRight size={10} />{trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ color, fontSize: 20, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{display}</div>
        <div style={{ color: MUTED, fontSize: 11, fontWeight: 500, marginTop: 4 }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── At-Risk Capital ─── */
function AtRiskCard() {
  const total = CUSTOMERS.reduce((s, c) => s + c.balance, 0);
  const overdue = CUSTOMERS.filter(c => c.daysSincePayment > 30).reduce((s, c) => s + c.balance, 0);
  const count = CUSTOMERS.filter(c => c.riskScore === 'high_risk').length;
  const animTotal = useCountUp(total);
  const animOverdue = useCountUp(overdue);

  return (
    <div className="rounded-3xl p-6 flex flex-col h-full overflow-hidden" style={{
      ...card,
      boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(191,4,4,0.12), 0 0 80px rgba(191,4,4,0.04)',
    }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(191,4,4,0.12)' }}>
            <AlertTriangle size={15} color="#bf0404" />
          </div>
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>At-Risk Capital</span>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ background: '#bf0404', boxShadow: '0 0 10px #bf0404' }}
        />
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(191,4,4,0.07)', border: '1px solid rgba(191,4,4,0.12)' }}>
        <div style={{ color: MUTED, fontSize: 11, fontWeight: 500 }}>Total Unpaid Debt</div>
        <div style={{ color: '#bf0404', fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginTop: 4 }}>
          {formatCurrency(animTotal)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        <div className="rounded-2xl p-3.5 flex flex-col justify-between" style={{ background: INNER }}>
          <div style={{ color: MUTED, fontSize: 10, fontWeight: 600 }}>Overdue Debt</div>
          <div style={{ color: '#F59E0B', fontSize: 16, fontWeight: 800 }}>{formatCurrency(animOverdue)}</div>
        </div>
        <div className="rounded-2xl p-3.5 flex flex-col justify-between" style={{ background: INNER }}>
          <div style={{ color: MUTED, fontSize: 10, fontWeight: 600 }}>High Risk</div>
          <div style={{ color: '#bf0404', fontSize: 16, fontWeight: 800 }}>{count} accounts</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Debt Aging Chart ─── */
function DebtAgingChart() {
  const total = DEBT_AGING.reduce((s, d) => s + d.amount, 0);
  return (
    <div className="rounded-3xl p-6 flex flex-col h-full min-h-[300px] lg:min-h-0" style={card}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>Debt Aging Buckets</span>
        <span className="px-2.5 py-1 rounded-full" style={{ background: INNER, color: MUTED, fontSize: 11 }}>
          {formatCurrency(total)} total
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 shrink-0 flex-wrap">
        {DEBT_AGING.map(d => (
          <div key={d.bucket} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span style={{ color: MUTED, fontSize: 10, fontWeight: 500 }}>{d.bucket}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEBT_AGING} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.035)' }}
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              formatter={(v: number) => [formatCurrency(v), 'Amount']}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {DEBT_AGING.map((d, i) => <Cell key={i} fill={d.color} opacity={0.9} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Recent Sales ─── */
function RecentSales() {
  return (
    <div className="rounded-3xl p-6 flex flex-col h-full min-h-[320px] lg:min-h-0" style={card}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Clock size={14} color={MUTED} />
          <span style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>Recent Sales</span>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: '#10B981', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em' }}
        >
          ● LIVE
        </motion.div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
        {RECENT_SALES.map(tx => {
          const mc = METHOD_CONFIG[tx.method];
          return (
            <div key={tx.id} className="flex items-center justify-between px-3.5 py-3 rounded-2xl" style={{ background: INNER }}>
              <div className="min-w-0">
                <div style={{ color: TEXT, fontSize: 12, fontWeight: 600 }} className="truncate">{tx.customer}</div>
                <div style={{ color: MUTED, fontSize: 10, marginTop: 1 }}>{tx.time} · {tx.items} items</div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div style={{ color: TEXT, fontSize: 13, fontWeight: 800 }}>{formatCurrency(tx.total)}</div>
                <span className="px-1.5 py-0.5 rounded-md" style={{ background: `${mc.color}18`, color: mc.color, fontSize: 9, fontWeight: 800 }}>
                  {mc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Top Debtors ─── */
function TopDebtors() {
  const sorted = [...CUSTOMERS].sort((a, b) => b.balance - a.balance).slice(0, 8);
  return (
    <div className="rounded-3xl p-6 flex flex-col h-full min-h-[320px] lg:min-h-0" style={card}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>Top Debtors</span>
        <span style={{ color: MUTED, fontSize: 11 }}>{sorted.length} accounts</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
        {sorted.map((c, idx) => (
          <div key={c.id} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ background: INNER }}>
            <div style={{ color: MUTED, fontSize: 11, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
              {idx + 1}
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm" style={{ background: `${RISK_CONFIG[c.riskScore].color}18`, color: RISK_CONFIG[c.riskScore].color, fontWeight: 800 }}>
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ color: TEXT, fontSize: 12, fontWeight: 600 }} className="truncate">{c.name}</div>
              <RiskBadge score={c.riskScore} />
            </div>
            <div className="text-right shrink-0">
              <div style={{ color: c.riskScore === 'high_risk' ? '#bf0404' : TEXT, fontSize: 13, fontWeight: 800 }}>
                {formatCurrency(c.balance)}
              </div>
              <div style={{ color: MUTED, fontSize: 10 }}>{c.daysSincePayment}d</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Filipino date (Day, Buwan Petsa, Taon) ─── */
const PH_DAYS = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];
const PH_MONTHS = ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'];
function formatPhDate(d: Date) {
  return `${PH_DAYS[d.getDay()]}, ${PH_MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* Live date + time — self-contained so its 1s tick doesn't re-render the charts. */
function LiveDateTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return <>{formatPhDate(now)} · {time}</>;
}

/* ─── Dashboard Page ─── */
export function Dashboard() {
  const totalInventoryValue = PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0);
  const activeUtang = CUSTOMERS.filter(c => c.balance > 0).length;

  // Mock refresh for the prototype — spin the icon and simulate fetching latest data.
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    toast.promise(new Promise<void>(resolve => setTimeout(resolve, 1200)), {
      loading: 'Ina-update ang datos...',
      success: 'Na-refresh ang dashboard! ✓',
      error: 'Hindi ma-refresh',
    });
    setTimeout(() => setRefreshing(false), 1200);
  };

  const metrics = [
    { label: 'Benta Ngayon', value: 12456, formatted: '₱12,456.00', icon: TrendingUp, color: '#10B981', trend: '+12%' },
    { label: 'Tubong Inaasahan', value: 3782, formatted: '₱3,782.00', icon: Wallet, color: '#1800ad', trend: '+8%' },
    { label: 'At-Risk Capital', value: 18950, formatted: '₱18,950.00', icon: AlertTriangle, color: '#bf0404' },
    { label: 'Inventory Value', value: totalInventoryValue, formatted: `₱${totalInventoryValue.toLocaleString()}.00`, icon: Package, color: '#F59E0B' },
    { label: 'Active Utang Accounts', value: activeUtang, formatted: `${activeUtang} accounts`, icon: Users, color: MUTED },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto lg:overflow-hidden p-4 sm:p-5 gap-3.5" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Command Center
          </h1>
          <p style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>
            <LiveDateTime /> · Santos General Store
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors"
          style={{ background: CARD, color: MUTED, fontSize: 12, border: '1px solid rgba(255,255,255,0.05)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEXT; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = MUTED; }}
        >
          <motion.span
            className="inline-flex"
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
          >
            <RefreshCw size={12} />
          </motion.span>
          {refreshing ? 'Nire-refresh...' : 'Refresh'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 shrink-0">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Middle + Bottom — stacks on mobile, shares remaining space on desktop */}
      <div className="flex flex-col gap-3.5 lg:grid lg:flex-1 lg:min-h-0 lg:[grid-template-rows:minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Row 2: At-Risk + Debt Aging */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:min-h-0 lg:overflow-hidden">
          <AtRiskCard />
          <DebtAgingChart />
        </div>

        {/* Row 3: Recent Sales + Top Debtors */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2 lg:min-h-0 lg:overflow-hidden">
          <RecentSales />
          <TopDebtors />
        </div>
      </div>
    </div>
  );
}
