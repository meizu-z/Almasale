import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
  PieChart, Pie, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';
import { formatCurrency } from './mockData';

const BG = '#000000';
const CARD = '#121212';
const INNER = '#0a0a0a';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';
const card = { background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' };

const WEEKLY = [
  { day: 'Lun', sales: 8400, profit: 2520 },
  { day: 'Mar', sales: 12456, profit: 3782 },
  { day: 'Miy', sales: 9800, profit: 2940 },
  { day: 'Huw', sales: 14200, profit: 4260 },
  { day: 'Biy', sales: 16800, profit: 5040 },
  { day: 'Sab', sales: 21000, profit: 6300 },
  { day: 'Lin', sales: 18500, profit: 5550 },
];

const PAYMENT_METHODS = [
  { name: 'Cash', value: 58, color: '#10B981' },
  { name: 'GCash', value: 22, color: '#1800ad' },
  { name: 'Maya', value: 11, color: '#34D399' },
  { name: 'Utang', value: 9, color: '#F59E0B' },
];

const TOP_PRODUCTS = [
  { name: 'Ganador Rice (1kg)', sold: 280, color: '#1800ad' },
  { name: 'Nescafe 3-in-1 (sachet)', sold: 540, color: '#10B981' },
  { name: 'Lucky Me Pancit Canton', sold: 320, color: '#F59E0B' },
  { name: '555 Sardines (Regular)', sold: 240, color: '#10B981' },
  { name: 'Tide Powder (sachet)', sold: 580, color: '#1800ad' },
  { name: 'Palm Oil 250ml', sold: 85, color: '#F59E0B' },
];

const TOOLTIP = {
  contentStyle: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, fontSize: 12 },
  labelStyle: { color: TEXT },
};

const KPI = [
  { label: 'Lingguhang Benta', value: '₱101,156', sub: '+14% vs last week', icon: TrendingUp, color: '#10B981' },
  { label: 'Kabuuang Tubo', value: '₱30,392', sub: 'Gross margin: 30%', icon: Wallet, color: '#1800ad' },
  { label: 'Ave. Daily Sales', value: '₱14,451', sub: 'Based on last 7 days', icon: TrendingDown, color: '#F59E0B' },
  { label: 'Unique Customers', value: '47', sub: 'This week', icon: Users, color: MUTED },
];

export function Analytics() {
  const maxSold = Math.max(...TOP_PRODUCTS.map(p => p.sold));

  return (
    <div className="h-full flex flex-col overflow-hidden p-6 gap-4" style={{ background: BG }}>
      <div className="shrink-0">
        <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Analytics</h1>
        <p style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>Lingguhang buod ng negosyo · Hunyo 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {KPI.map(({ label, value, sub, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-5" style={card}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}12` }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ color, fontSize: 20, fontWeight: 900, letterSpacing: '-0.01em' }}>{value}</div>
            <div style={{ color: TEXT, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{label}</div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex-1 min-h-0" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        {/* Weekly Bar Chart */}
        <div className="rounded-3xl p-6 flex flex-col" style={card}>
          <div className="flex items-center justify-between mb-4 shrink-0">
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Weekly Sales vs Profit</span>
            <div className="flex items-center gap-4">
              {[{ label: 'Sales', color: '#1800ad' }, { label: 'Profit', color: '#10B981' }].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span style={{ color: MUTED, fontSize: 11 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barGap={4} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...TOOLTIP} formatter={(v: number, name: string) => [formatCurrency(v), name === 'sales' ? 'Sales' : 'Profit']} />
                <Bar dataKey="sales" fill="#1800ad" radius={[6, 6, 0, 0]} opacity={0.9} />
                <Bar dataKey="profit" fill="#10B981" radius={[6, 6, 0, 0]} opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 14, minHeight: 0 }}>
          {/* Payment Methods Pie */}
          <div className="rounded-3xl p-5 flex flex-col" style={card}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 13, marginBottom: 8 }} className="shrink-0">
              Payment Methods
            </span>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_METHODS} dataKey="value" cx="40%" cy="50%" outerRadius="80%" innerRadius="50%" paddingAngle={3}>
                    {PAYMENT_METHODS.map((p, i) => <Cell key={i} fill={p.color} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} formatter={(v: number) => [`${v}%`, 'Share']} />
                  <Legend
                    layout="vertical" align="right" verticalAlign="middle"
                    formatter={(value) => <span style={{ color: MUTED, fontSize: 11 }}>{value}</span>}
                    iconSize={8} iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-3xl p-5 flex flex-col" style={card}>
            <span style={{ color: TEXT, fontWeight: 700, fontSize: 13, marginBottom: 12 }} className="shrink-0">
              Top Products
            </span>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3" style={{ scrollbarWidth: 'none' }}>
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ color: TEXT, fontSize: 11, fontWeight: 500 }} className="truncate pr-2">{p.name}</span>
                    <span style={{ color: MUTED, fontSize: 11 }}>{p.sold} sold</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.sold / maxSold) * 100}%` }}
                      transition={{ duration: 0.9, delay: i * 0.07, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
