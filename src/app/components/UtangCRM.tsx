import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, AlertTriangle, TrendingDown, CheckCircle,
  Search, ChevronRight, X, Lock, Save,
} from 'lucide-react';
import { CUSTOMERS, Customer, formatCurrency, RISK_CONFIG, tiwaLabel, tiwaColor } from './mockData';

const BG = '#000000';
const CARD = '#121212';
const INNER = '#0a0a0a';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';
const card = { background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' };

type FilterType = 'all' | 'good' | 'monitor' | 'high_risk';

/* ─── Tiwala Score Ring ─── */
function TiwaScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const color = tiwaColor(score);
  const label = tiwaLabel(score);
  const offset = circ * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        {/* Score label centered */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            style={{ color, fontSize: 26, fontWeight: 900, lineHeight: 1 }}
          >
            {score}
          </motion.div>
          <div style={{ color: MUTED, fontSize: 9, fontWeight: 600 }}>/ 100</div>
        </div>
      </div>
      <div style={{ color, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ color: MUTED, fontSize: 10 }}>Tiwala Score</div>
    </div>
  );
}

/* ─── Risk Badge ─── */
function RiskBadge({ score, pulse }: { score: 'good' | 'monitor' | 'high_risk'; pulse?: boolean }) {
  const c = RISK_CONFIG[score];
  return (
    <motion.span
      layout
      animate={pulse ? { boxShadow: [`0 0 0px ${c.color}`, `0 0 10px ${c.color}`, `0 0 0px ${c.color}`] } : {}}
      transition={{ duration: 1.8, repeat: pulse ? Infinity : 0 }}
      className="px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
      style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
    >
      {score === 'high_risk' && (
        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>●</motion.span>
      )}
      {c.label}
    </motion.span>
  );
}

/* ─── Customer Row ─── */
function CustomerRow({
  customer, manualLimit, limitInput,
  onMarkPaid, onLimitChange, onSaveLimit,
}: {
  customer: Customer;
  manualLimit: number;
  limitInput: string;
  onMarkPaid: () => void;
  onLimitChange: (v: string) => void;
  onSaveLimit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const effectiveLimit = manualLimit || customer.creditLimit;
  const utilization = Math.min(100, Math.round((customer.balance / effectiveLimit) * 100));
  const isOverLimit = customer.balance > effectiveLimit;
  const limitSaved = manualLimit > 0;

  return (
    <motion.div layout className="rounded-3xl overflow-hidden" style={card}>
      {/* Summary row */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
        onClick={() => setExpanded(!expanded)}
        style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${RISK_CONFIG[customer.riskScore].color}15`, color: RISK_CONFIG[customer.riskScore].color, fontWeight: 900, fontSize: 17 }}>
          {customer.name[0]}
        </div>

        {/* Name + info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ color: TEXT, fontSize: 14, fontWeight: 700 }}>{customer.name}</span>
            <RiskBadge score={customer.riskScore} pulse={customer.riskScore === 'high_risk'} />
            {limitSaved && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(24,0,173,0.12)', color: '#818cf8', fontSize: 9, fontWeight: 700 }}>
                <Lock size={8} /> MANUAL LIMIT
              </span>
            )}
          </div>
          <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{customer.phone} · {customer.address}</div>

          {/* Utilization bar */}
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${utilization}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full"
                style={{ background: isOverLimit ? '#bf0404' : utilization > 70 ? '#F59E0B' : '#10B981' }}
              />
            </div>
            <span style={{ color: MUTED, fontSize: 9, fontWeight: 600 }}>{utilization}%</span>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right shrink-0 ml-2">
          <div style={{ color: customer.balance > 0 ? (customer.riskScore === 'high_risk' ? '#bf0404' : TEXT) : '#10B981', fontSize: 15, fontWeight: 900, letterSpacing: '-0.01em' }}>
            {formatCurrency(customer.balance)}
          </div>
          <div style={{ color: MUTED, fontSize: 10, marginTop: 1 }}>of {formatCurrency(effectiveLimit)}</div>
          <div style={{ color: MUTED, fontSize: 10 }}>{customer.daysSincePayment}d since payment</div>
        </div>

        <ChevronRight size={15} color={MUTED} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Customer Profile: Tiwala Score + Manual Limit */}
              <div className="rounded-2xl p-5" style={{ background: INNER, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: MUTED, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                  Customer Profile
                </div>
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-5 sm:gap-6">
                  {/* Left: Tiwala Score Ring */}
                  <div className="shrink-0">
                    <TiwaScoreRing score={customer.tiwaScore} />
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block" style={{ width: 1, background: 'rgba(255,255,255,0.06)', alignSelf: 'stretch' }} />

                  {/* Right: Manual Credit Limit */}
                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={12} color="#1800ad" />
                        <label style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          Maximum Credit Limit
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* ₱ prefix + input */}
                        <div className="flex-1 relative">
                          <span
                            className="absolute left-3.5 top-1/2 -translate-y-1/2"
                            style={{ color: '#94A3B8', fontSize: 15, fontWeight: 700 }}
                          >
                            ₱
                          </span>
                          <input
                            type="number"
                            value={limitInput}
                            onChange={e => onLimitChange(e.target.value)}
                            placeholder={customer.creditLimit.toString()}
                            className="w-full pl-8 pr-4 py-3 rounded-2xl outline-none transition-all"
                            style={{
                              background: '#141414',
                              color: TEXT,
                              border: '1.5px solid rgba(24,0,173,0.3)',
                              fontSize: 16,
                              fontWeight: 800,
                            }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1800ad'}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(24,0,173,0.3)'}
                          />
                        </div>
                        <button
                          onClick={onSaveLimit}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors"
                          style={{ background: '#1800ad', color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(24,0,173,0.4)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
                        >
                          <Save size={13} /> Save Limit
                        </button>
                      </div>
                    </div>

                    {limitSaved && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(24,0,173,0.08)', border: '1px solid rgba(24,0,173,0.15)' }}
                      >
                        <CheckCircle size={12} color="#1800ad" />
                        <span style={{ color: '#818cf8', fontSize: 11, fontWeight: 600 }}>
                          Manual limit set to {formatCurrency(manualLimit)}
                        </span>
                      </motion.div>
                    )}

                    <div style={{ color: MUTED, fontSize: 11, lineHeight: 1.5 }}>
                      This overrides the system default. The customer cannot borrow beyond this amount regardless of their Tiwala Score.
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Balance', value: formatCurrency(customer.balance), color: customer.balance > 0 ? '#bf0404' : '#10B981' },
                  { label: 'Credit Limit', value: formatCurrency(effectiveLimit), color: TEXT },
                  { label: 'Available', value: formatCurrency(Math.max(0, effectiveLimit - customer.balance)), color: '#10B981' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl p-3.5" style={{ background: INNER }}>
                    <div style={{ color: MUTED, fontSize: 10, fontWeight: 600 }}>{label}</div>
                    <div style={{ color, fontSize: 14, fontWeight: 800, marginTop: 3 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Over-limit warning */}
              {isOverLimit && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'rgba(191,4,4,0.07)', border: '1px solid rgba(191,4,4,0.18)' }}>
                  <AlertTriangle size={14} color="#bf0404" />
                  <span style={{ color: '#bf0404', fontSize: 12, fontWeight: 600 }}>
                    Overdue by {formatCurrency(customer.balance - effectiveLimit)} — exceeds manual credit limit
                  </span>
                </div>
              )}

              {/* Action buttons — premium styling */}
              <div className="flex gap-2.5">
                {/* Primary solid button */}
                <button
                  onClick={onMarkPaid}
                  className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#10B981', color: '#000', fontSize: 13, fontWeight: 700 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#059669'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#10B981'}
                >
                  <CheckCircle size={15} /> Mark as Paid
                </button>

                {/* Secondary outline button */}
                <button
                  className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  style={{ background: 'transparent', border: '1.5px solid #1800ad', color: '#818cf8', fontSize: 13, fontWeight: 700 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(24,0,173,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <TrendingDown size={15} /> Adjust Limit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Utang CRM Page ─── */
export function UtangCRM() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [manualLimits, setManualLimits] = useState<Record<string, number>>({});
  const [limitInputs, setLimitInputs] = useState<Record<string, string>>({});

  const totalDebt = customers.reduce((s, c) => s + c.balance, 0);
  const highRiskCount = customers.filter(c => c.riskScore === 'high_risk').length;
  const monitorCount = customers.filter(c => c.riskScore === 'monitor').length;

  const filtered = customers
    .filter(c => filter === 'all' || c.riskScore === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const markPaid = (id: string) => {
    setCustomers(prev =>
      prev.map(c => c.id === id ? { ...c, balance: 0, riskScore: 'good', daysSincePayment: 0, tiwaScore: Math.min(99, c.tiwaScore + 15) } : c)
    );
  };

  const saveLimit = (id: string) => {
    const val = parseFloat(limitInputs[id] || '0');
    if (val > 0) setManualLimits(prev => ({ ...prev, [id]: val }));
  };

  const FILTERS: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'Lahat', color: MUTED },
    { id: 'good', label: 'Good', color: '#10B981' },
    { id: 'monitor', label: 'Monitor', color: '#F59E0B' },
    { id: 'high_risk', label: 'High Risk', color: '#bf0404' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto lg:overflow-hidden p-4 sm:p-6 gap-4" style={{ background: BG }}>
      {/* Header */}
      <div className="shrink-0">
        <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Utang CRM</h1>
        <p style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>Credit ledger, Tiwala Score, at risk management</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        {[
          { label: 'Total Outstanding', value: formatCurrency(totalDebt), icon: TrendingDown, color: '#bf0404' },
          { label: 'High Risk Accounts', value: `${highRiskCount} accounts`, icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Under Monitoring', value: `${monitorCount} accounts`, icon: Users, color: '#1800ad' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}12` }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ color, fontSize: 18, fontWeight: 900, letterSpacing: '-0.01em' }}>{value}</div>
            <div style={{ color: MUTED, fontSize: 11, fontWeight: 500, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={14} color={MUTED} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hanapin ang customer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl outline-none"
            style={{ background: CARD, color: TEXT, border: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={13} color={MUTED} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3.5 py-2 rounded-xl transition-all text-sm"
              style={{
                background: filter === f.id ? f.color : 'transparent',
                color: filter === f.id ? (f.id === 'all' ? '#000' : '#fff') : MUTED,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer list */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-3">
              <Users size={40} color="#222" />
              <p style={{ color: MUTED, fontSize: 14 }}>Walang nahanap na customer</p>
            </motion.div>
          )}
          {filtered.map(c => (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
              <CustomerRow
                customer={c}
                manualLimit={manualLimits[c.id] || 0}
                limitInput={limitInputs[c.id] ?? ''}
                onMarkPaid={() => markPaid(c.id)}
                onLimitChange={v => setLimitInputs(prev => ({ ...prev, [c.id]: v }))}
                onSaveLimit={() => saveLimit(c.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
