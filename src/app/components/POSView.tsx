import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowLeft, Camera, Keyboard, Minus, Plus, ShoppingCart,
  X, CheckCircle, Wifi, WifiOff, ChevronDown, User, Printer, Send, RotateCcw,
} from 'lucide-react';
import { CUSTOMERS, PRODUCTS, CartItem, Customer, formatCurrency, RISK_CONFIG } from './mockData';

const BG = '#000000';
const CARD = '#121212';
const INNER = '#0a0a0a';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';

type POSStep = 'customer' | 'mode' | 'scanner' | 'manual' | 'cart' | 'receipt';
type PayMethod = 'cash' | 'gcash' | 'maya' | 'utang';

interface Receipt {
  id: string; customer: string; items: CartItem[];
  total: number; method: PayMethod; tendered: number; sukli: number; time: string;
}

function RiskBadge({ score }: { score: 'good' | 'monitor' | 'high_risk' }) {
  const c = RISK_CONFIG[score];
  return (
    <span className="px-2 py-0.5 rounded-full inline-block" style={{ background: c.bg, color: c.color, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}

/* ─── Step 1: Customer Gatekeeper ─── */
function CustomerStep({ selected, onSelect, onNext }: { selected: Customer | null; onSelect: (c: Customer | null) => void; onNext: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div>
        <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Sino ang Customer?</h2>
        <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Piliin ang customer bago mag-simula ng transaksyon.</p>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between rounded-2xl px-5 py-4"
          style={{ background: CARD, border: '1.5px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: selected ? `${RISK_CONFIG[selected.riskScore].color}15` : 'rgba(255,255,255,0.06)' }}>
              <User size={18} color={selected ? RISK_CONFIG[selected.riskScore].color : MUTED} />
            </div>
            <div className="text-left">
              <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{selected ? selected.name : 'Walk-in Customer'}</div>
              {!selected && <div style={{ color: MUTED, fontSize: 12 }}>Default — walang credit</div>}
            </div>
          </div>
          <ChevronDown size={18} color={MUTED} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden z-50"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
            >
              <button
                className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors"
                style={{ color: MUTED }}
                onClick={() => { onSelect(null); setOpen(false); }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <User size={16} /><span style={{ fontSize: 14 }}>Walk-in Customer</span>
              </button>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              {CUSTOMERS.map(c => (
                <button key={c.id} className="w-full flex items-center justify-between px-5 py-3 transition-colors"
                  onClick={() => { onSelect(c); setOpen(false); }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${RISK_CONFIG[c.riskScore].color}15`, color: RISK_CONFIG[c.riskScore].color, fontWeight: 800 }}>{c.name[0]}</div>
                    <span style={{ color: TEXT, fontSize: 14 }}>{c.name}</span>
                  </div>
                  <RiskBadge score={c.riskScore} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-3xl p-5" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ color: TEXT, fontSize: 17, fontWeight: 800 }}>{selected.name}</div>
                <div style={{ color: MUTED, fontSize: 12 }}>{selected.phone}</div>
              </div>
              <RiskBadge score={selected.riskScore} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3.5" style={{ background: INNER }}>
                <div style={{ color: MUTED, fontSize: 11 }}>Outstanding Balance</div>
                <div style={{ color: selected.balance > 0 ? '#bf0404' : '#10B981', fontSize: 16, fontWeight: 900 }}>{formatCurrency(selected.balance)}</div>
              </div>
              <div className="rounded-2xl p-3.5" style={{ background: INNER }}>
                <div style={{ color: MUTED, fontSize: 11 }}>Available Credit</div>
                <div style={{ color: TEXT, fontSize: 16, fontWeight: 900 }}>{formatCurrency(Math.max(0, selected.creditLimit - selected.balance))}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1.5">
                <span style={{ color: MUTED, fontSize: 11 }}>Tiwala Score</span>
                <span style={{ color: MUTED, fontSize: 11 }}>{selected.tiwaScore} / 100</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${selected.tiwaScore}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: selected.tiwaScore >= 80 ? '#10B981' : selected.tiwaScore >= 50 ? '#F59E0B' : '#bf0404' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto">
        <button onClick={onNext} className="w-full py-4 rounded-2xl transition-colors"
          style={{ background: '#1800ad', color: '#fff', fontSize: 16, fontWeight: 800, boxShadow: '0 8px 32px rgba(24,0,173,0.45)', minHeight: 56 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
        >
          Ituloy ang Transaksyon →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: Entry Mode ─── */
function ModeStep({ onScan, onManual }: { onScan: () => void; onManual: () => void }) {
  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div>
        <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Paano mag-input?</h2>
        <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Piliin ang paraan ng pagpasok ng produkto.</p>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {[
          { fn: onScan, emoji: '📷', title: 'Gamitin ang Scanner', desc: 'I-scan ang mga branded goods gamit ang camera ng device.', color: '#1800ad', textColor: '#818cf8' },
          { fn: onManual, emoji: '⌨️', title: 'Manual na Paghahanap', desc: 'Hanapin ang produkto o pumili mula sa quick-tap grid.', color: 'rgba(255,255,255,0.06)', textColor: MUTED },
        ].map(({ fn, emoji, title, desc, color, textColor }) => (
          <motion.button key={title} whileTap={{ scale: 0.97 }} onClick={fn}
            className="flex-1 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all"
            style={{ background: CARD, border: `1.5px solid ${color}30`, minHeight: 160 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}60`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}30`}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${color}15` }}>{emoji}</div>
            <div className="text-center">
              <div style={{ color: TEXT, fontSize: 18, fontWeight: 800 }}>{title}</div>
              <div style={{ color: MUTED, fontSize: 13, marginTop: 6 }}>{desc}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 3A: Scanner ─── */
function ScannerStep({ cart, onAdd, onDone }: { cart: CartItem[]; onAdd: (p: typeof PRODUCTS[0]) => void; onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => setCameraError(true));
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const simulateScan = useCallback(() => {
    const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    onAdd(p);
    toast.success(`✓ ${p.name}`, { icon: '🛒' });
  }, [onAdd]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 relative overflow-hidden" style={{ background: '#000' }}>
        {!cameraError
          ? <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: '#080808' }}><Camera size={48} color="#333" /><p style={{ color: MUTED, fontSize: 13 }}>Camera unavailable — Demo Mode</p></div>
        }
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[220px] max-w-[80%] aspect-square">
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)' }} />
            <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-2xl" style={{ borderTop: '3px solid #10B981', borderLeft: '3px solid #10B981' }} />
            <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-2xl" style={{ borderTop: '3px solid #10B981', borderRight: '3px solid #10B981' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-2xl" style={{ borderBottom: '3px solid #10B981', borderLeft: '3px solid #10B981' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-2xl" style={{ borderBottom: '3px solid #10B981', borderRight: '3px solid #10B981' }} />
            <motion.div className="absolute left-3 right-3 rounded-full" style={{ height: 2, background: 'linear-gradient(90deg,transparent,#10B981,transparent)', boxShadow: '0 0 16px #10B981', top: '50%' }}
              animate={{ y: [-90, 90] }} transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
          </div>
        </div>
        <div className="absolute top-6 left-0 right-0 flex justify-center">
          <div className="px-4 py-2 rounded-full" style={{ background: 'rgba(0,0,0,0.75)', color: TEXT, fontSize: 12 }}>I-point ang camera sa barcode</div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button onClick={simulateScan} className="px-6 py-3 rounded-2xl transition-colors" style={{ background: '#1800ad', color: '#fff', fontSize: 14, fontWeight: 800, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
          >⚡ Simulate Scan</button>
        </div>
      </div>
      {cartCount > 0 && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="shrink-0 mx-4 mb-4 mt-3">
          <button onClick={onDone} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: '#1800ad', boxShadow: '0 8px 28px rgba(24,0,173,0.5)' }}>
            <div className="flex items-center gap-3">
              <div className="relative"><ShoppingCart size={20} color="white" />
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#bf0404', fontSize: 10, color: '#fff', fontWeight: 900 }}>{cartCount}</div>
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Tingnan ang Cart</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{formatCurrency(cartTotal)}</span>
          </button>
        </motion.div>
      )}
      {cartCount === 0 && (
        <div className="shrink-0 p-4">
          <button onClick={onDone} className="w-full py-3 rounded-2xl" style={{ background: CARD, color: MUTED, fontSize: 13, border: '1px solid rgba(255,255,255,0.06)' }}>
            Walang laman — bumalik
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Step 3B: Manual ─── */
function ManualStep({ cart, onAdd, onDone }: { cart: CartItem[]; onAdd: (p: typeof PRODUCTS[0]) => void; onDone: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const handleAdd = (p: typeof PRODUCTS[0]) => { onAdd(p); toast.success(`✓ ${p.name}`, { icon: '🛒' }); };

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <h2 style={{ color: TEXT, fontSize: 20, fontWeight: 900 }}>Manual na Paghahanap</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Hanapin ang produkto..." autoFocus
        className="w-full px-4 py-3.5 rounded-2xl outline-none"
        style={{ background: CARD, color: TEXT, border: '1.5px solid rgba(255,255,255,0.07)', fontSize: 14 }} />
      <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-2 gap-2.5 pb-2">
          {filtered.map(p => {
            const inCart = cart.find(ci => ci.product.id === p.id);
            return (
              <motion.button key={p.id} whileTap={{ scale: 0.95 }} onClick={() => handleAdd(p)}
                className="flex flex-col items-start p-4 rounded-2xl text-left relative"
                style={{ background: CARD, border: inCart ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.05)', minHeight: 100 }}>
                {inCart && (<div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#10B981', fontSize: 9, color: '#000', fontWeight: 900 }}>{inCart.quantity}</div>)}
                <span className="text-2xl mb-2">{p.icon}</span>
                <div style={{ color: TEXT, fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ color: '#10B981', fontSize: 13, fontWeight: 900, marginTop: 4 }}>{formatCurrency(p.price)}</div>
                <div style={{ color: MUTED, fontSize: 10, marginTop: 2 }}>Stock: {p.stock}</div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {cartCount > 0 && (
        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onDone}
          className="shrink-0 w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-colors"
          style={{ background: '#1800ad', boxShadow: '0 8px 28px rgba(24,0,173,0.45)', minHeight: 56 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
        >
          <div className="flex items-center gap-3"><ShoppingCart size={20} color="white" /><span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Tingnan ang Cart ({cartCount})</span></div>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>{formatCurrency(cartTotal)}</span>
        </motion.button>
      )}
    </div>
  );
}

/* ─── Step 4: Cart + Payment ─── */
function CartStep({ cart, customer, onUpdateQty, onRemove, onProceed, onBack }: {
  cart: CartItem[]; customer: Customer | null;
  onUpdateQty: (id: string, delta: number) => void; onRemove: (id: string) => void;
  onProceed: (method: PayMethod, tendered: number, sukli: number) => void; onBack: () => void;
}) {
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [tendered, setTendered] = useState('');
  const [showBlock, setShowBlock] = useState(false);
  const [shake, setShake] = useState(false);

  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tenderedNum = parseFloat(tendered) || 0;
  const sukli = tenderedNum - total;

  const handlePayMethod = (m: PayMethod) => {
    if (m === 'utang' && !customer) {
      setShowBlock(true);
      setTimeout(() => { setShake(true); setTimeout(() => setShake(false), 600); }, 50);
      return;
    }
    if (m === 'utang' && customer && customer.balance >= customer.creditLimit) {
      toast.error(`Credit limit reached for ${customer.name}`);
      return;
    }
    setPayMethod(m);
  };

  const handleConfirm = () => {
    if (!payMethod) return;
    if ((payMethod === 'cash' || payMethod === 'gcash' || payMethod === 'maya') && tenderedNum < total) {
      toast.error('Kulang ang halaga!');
      return;
    }
    onProceed(payMethod, tenderedNum, payMethod === 'cash' ? sukli : 0);
  };

  const PAY_BUTTONS = [
    { m: 'cash' as PayMethod, label: 'CASH', bg: '#10B981', text: '#000' },
    { m: 'gcash' as PayMethod, label: 'GCash', bg: '#1800ad', text: '#fff' },
    { m: 'maya' as PayMethod, label: 'Maya', bg: '#10B981', text: '#000' },
    { m: 'utang' as PayMethod, label: 'UTANG', bg: '#F59E0B', text: '#000' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-0 space-y-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ color: TEXT, fontSize: 18, fontWeight: 900 }}>Cart</h2>
          <span style={{ color: MUTED, fontSize: 13 }}>{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
        </div>
        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ShoppingCart size={40} color="#222" />
            <p style={{ color: MUTED, fontSize: 13 }}>Walang laman ang cart</p>
            <button onClick={onBack} style={{ color: '#1800ad', fontSize: 13, fontWeight: 700 }}>← Bumalik</button>
          </div>
        )}
        {cart.map(item => (
          <div key={item.product.id} className="rounded-2xl p-4" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.product.icon}</span>
                <div>
                  <div style={{ color: TEXT, fontSize: 13, fontWeight: 700 }}>{item.product.name}</div>
                  <div style={{ color: MUTED, fontSize: 12 }}>{formatCurrency(item.product.price)} / unit</div>
                </div>
              </div>
              <button onClick={() => onRemove(item.product.id)}><X size={15} color={MUTED} /></button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => onUpdateQty(item.product.id, -1)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: INNER, minWidth: 36 }}>
                  <Minus size={14} color={TEXT} />
                </button>
                <span style={{ color: TEXT, fontSize: 16, fontWeight: 900, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.product.id, 1)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: '#1800ad', minWidth: 36 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
                >
                  <Plus size={14} color="white" />
                </button>
              </div>
              <div style={{ color: TEXT, fontSize: 15, fontWeight: 900 }}>{formatCurrency(item.product.price * item.quantity)}</div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="shrink-0 p-4 space-y-3">
          <div className="rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: MUTED, fontSize: 14 }}>Grand Total</span>
            <span style={{ color: TEXT, fontSize: 24, fontWeight: 900 }}>{formatCurrency(total)}</span>
          </div>

          {!payMethod && (
            <div className="grid grid-cols-2 gap-2">
              {PAY_BUTTONS.map(({ m, label, bg, text }) => (
                <motion.button key={m} whileTap={{ scale: 0.96 }} onClick={() => handlePayMethod(m)}
                  className="rounded-2xl flex items-center justify-center transition-colors"
                  style={{ background: bg, color: text, fontSize: 15, fontWeight: 900, minHeight: 56, boxShadow: `0 4px 20px ${bg}40` }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >{label}</motion.button>
              ))}
            </div>
          )}

          {payMethod && payMethod !== 'utang' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-2xl p-4" style={{ background: CARD }}>
                <label style={{ color: MUTED, fontSize: 12 }}>Amount Tendered (Ibinayad)</label>
                <input type="number" value={tendered} onChange={e => setTendered(e.target.value)} placeholder="0.00" autoFocus
                  className="w-full mt-2 py-2 outline-none bg-transparent"
                  style={{ color: TEXT, fontSize: 28, fontWeight: 900, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <AnimatePresence>
                {sukli > 0 && (
                  <motion.div key={sukli} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="rounded-2xl p-5 text-center"
                    style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.25)', boxShadow: '0 0 40px rgba(16,185,129,0.1)' }}>
                    <div style={{ color: MUTED, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>SUKLI</div>
                    <motion.div key={sukli} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      style={{ color: '#10B981', fontSize: 38, fontWeight: 900, textShadow: '0 0 40px rgba(16,185,129,0.6)' }}>
                      {formatCurrency(sukli)}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-2">
                <button onClick={() => { setPayMethod(null); setTendered(''); }} className="flex-1 py-3.5 rounded-2xl transition-colors"
                  style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 14 }}>
                  Bumalik
                </button>
                <button onClick={handleConfirm} disabled={tenderedNum < total} className="flex-[2] py-3.5 rounded-2xl transition-colors"
                  style={{ background: tenderedNum >= total ? '#10B981' : '#1a1a1a', color: tenderedNum >= total ? '#000' : MUTED, fontSize: 15, fontWeight: 800, minHeight: 52 }}
                  onMouseEnter={e => { if (tenderedNum >= total) (e.currentTarget as HTMLElement).style.background = '#059669'; }}
                  onMouseLeave={e => { if (tenderedNum >= total) (e.currentTarget as HTMLElement).style.background = '#10B981'; }}
                >Kumpirmahin ✓</button>
              </div>
            </motion.div>
          )}

          {payMethod === 'utang' && customer && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(245,158,11,0.07)', border: '1.5px solid rgba(245,158,11,0.2)' }}>
                <div style={{ color: '#F59E0B', fontSize: 13, fontWeight: 800 }}>Utang Confirmation</div>
                <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>Ilalagay sa utang ni <strong style={{ color: TEXT }}>{customer.name}</strong></div>
                <div style={{ color: '#F59E0B', fontSize: 20, fontWeight: 900, marginTop: 8 }}>{formatCurrency(total)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPayMethod(null)} className="flex-1 py-3.5 rounded-2xl" style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 14 }}>Bumalik</button>
                <button onClick={handleConfirm} className="flex-[2] py-3.5 rounded-2xl transition-colors"
                  style={{ background: '#F59E0B', color: '#000', fontSize: 15, fontWeight: 800, boxShadow: '0 4px 20px rgba(245,158,11,0.35)', minHeight: 52 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#d97706'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F59E0B'}
                >I-record ang Utang</button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Utang block modal */}
      <AnimatePresence>
        {showBlock && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center z-50 px-4 pb-8"
            style={{ background: 'rgba(0,0,0,0.82)' }}>
            <motion.div
              animate={shake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="w-full rounded-3xl p-7"
              style={{ background: '#121212', border: '1px solid rgba(191,4,4,0.3)', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(191,4,4,0.12)' }}>
                  <X size={24} color="#bf0404" />
                </div>
                <div>
                  <div style={{ color: '#bf0404', fontSize: 18, fontWeight: 900 }}>Hindi Maaaring Mag-Utang</div>
                  <div style={{ color: MUTED, fontSize: 13 }}>Walk-in customers cannot take credit.</div>
                </div>
              </div>
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                Please select a registered customer to allow a credit transaction (Utang).
              </p>
              <button onClick={() => setShowBlock(false)} className="w-full py-4 rounded-2xl transition-colors"
                style={{ background: '#bf0404', color: '#fff', fontSize: 15, fontWeight: 800, minHeight: 52 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#9e0303'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#bf0404'}
              >Bumalik at Pumili ng Customer</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Step 5: Receipt ─── */
function ReceiptStep({ receipt, onNew }: { receipt: Receipt; onNew: () => void }) {
  const mc = { cash: 'CASH', gcash: 'GCash', maya: 'Maya', utang: 'UTANG' };
  const mcColor = { cash: '#10B981', gcash: '#1800ad', maya: '#10B981', utang: '#F59E0B' };

  return (
    <div className="flex flex-col h-full p-6 gap-5">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }} className="flex justify-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', boxShadow: '0 0 50px rgba(16,185,129,0.25)' }}>
          <CheckCircle size={40} color="#10B981" />
        </div>
      </motion.div>
      <div className="text-center">
        <div style={{ color: '#10B981', fontSize: 22, fontWeight: 900 }}>Matagumpay!</div>
        <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>{receipt.time} · ID: {receipt.id}</div>
      </div>
      <div className="rounded-3xl p-5 flex-1 overflow-y-auto" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}>
        <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ color: MUTED, fontSize: 11 }}>Customer</div>
            <div style={{ color: TEXT, fontSize: 15, fontWeight: 800 }}>{receipt.customer}</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl" style={{ background: `${mcColor[receipt.method]}12`, color: mcColor[receipt.method], fontSize: 12, fontWeight: 800 }}>
            {mc[receipt.method]}
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {receipt.items.map(item => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{item.product.icon}</span>
                <span style={{ color: TEXT, fontSize: 13 }}>{item.product.name}</span>
                <span style={{ color: MUTED, fontSize: 12 }}>x{item.quantity}</span>
              </div>
              <span style={{ color: TEXT, fontSize: 13, fontWeight: 700 }}>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14 }} className="space-y-2">
          <div className="flex justify-between">
            <span style={{ color: MUTED, fontSize: 13 }}>Total</span>
            <span style={{ color: TEXT, fontSize: 16, fontWeight: 900 }}>{formatCurrency(receipt.total)}</span>
          </div>
          {receipt.method === 'cash' && receipt.tendered > 0 && (
            <>
              <div className="flex justify-between"><span style={{ color: MUTED, fontSize: 13 }}>Ibinayad</span><span style={{ color: TEXT, fontSize: 13 }}>{formatCurrency(receipt.tendered)}</span></div>
              <div className="flex justify-between"><span style={{ color: '#10B981', fontSize: 13, fontWeight: 800 }}>Sukli</span><span style={{ color: '#10B981', fontSize: 16, fontWeight: 900 }}>{formatCurrency(receipt.sukli)}</span></div>
            </>
          )}
        </div>
      </div>
      <div className="shrink-0 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <button className="py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 13 }}>
            <Printer size={15} /> I-print
          </button>
          <button className="py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 13 }}>
            <Send size={15} /> E-Receipt
          </button>
        </div>
        <button onClick={onNew} className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          style={{ background: '#1800ad', color: '#fff', fontSize: 15, fontWeight: 800, boxShadow: '0 8px 32px rgba(24,0,173,0.45)', minHeight: 56 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
        ><RotateCcw size={18} /> Bagong Transaksyon</button>
      </div>
    </div>
  );
}

/* ─── Main POS View ─── */
export function POSView({ onBack, isOnline }: { onBack: () => void; isOnline: boolean }) {
  const [step, setStep] = useState<POSStep>('customer');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const STEP_LABELS: Record<POSStep, string> = {
    customer: 'Customer', mode: 'Paraan ng Input', scanner: 'Barcode Scanner',
    manual: 'Manual na Paghahanap', cart: 'Cart & Payment', receipt: 'Receipt',
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleProceed = (method: PayMethod, tendered: number, sukli: number) => {
    const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const time = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    setReceipt({ id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`, customer: customer ? customer.name : 'Walk-in Customer', items: [...cart], total, method, tendered, sukli, time });
    setStep('receipt');
  };

  const getBack = () => {
    const map: Partial<Record<POSStep, POSStep>> = { mode: 'customer', scanner: 'mode', manual: 'mode', cart: 'mode' };
    const prev = map[step];
    if (prev) setStep(prev); else onBack();
  };

  const steps: POSStep[] = ['customer', 'mode', 'scanner', 'manual', 'cart', 'receipt'];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="h-full flex items-stretch justify-center" style={{ background: '#050505' }}>
      <div className="h-full flex flex-col relative" style={{ background: BG, width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div className="shrink-0 flex items-center gap-3 px-5 pt-5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={getBack} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: CARD, border: '1px solid rgba(255,255,255,0.06)' }}>
            <ArrowLeft size={17} color={TEXT} />
          </button>
          <div className="flex-1">
            <div style={{ color: TEXT, fontSize: 15, fontWeight: 800 }}>{STEP_LABELS[step]}</div>
            <div style={{ color: MUTED, fontSize: 11 }}>
              {customer ? customer.name : 'Walk-in Customer'}
              {cart.length > 0 && ` · ${cart.reduce((s, i) => s + i.quantity, 0)} items`}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: isOnline ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${isOnline ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
            {isOnline ? <Wifi size={12} color="#10B981" /> : <WifiOff size={12} color="#F59E0B" />}
            <span style={{ fontSize: 10, color: isOnline ? '#10B981' : '#F59E0B', fontWeight: 800 }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="shrink-0 flex items-center gap-1 px-5 py-2.5">
          {['customer', 'mode', 'scanner', 'cart', 'receipt'].map((s, i) => {
            const thisIdx = steps.indexOf(s as POSStep);
            return (
              <div key={s} className="h-0.5 rounded-full flex-1" style={{ background: thisIdx <= currentIdx ? '#1800ad' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }} className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {step === 'customer' && <CustomerStep selected={customer} onSelect={setCustomer} onNext={() => setStep('mode')} />}
              {step === 'mode' && <ModeStep onScan={() => setStep('scanner')} onManual={() => setStep('manual')} />}
              {step === 'scanner' && <ScannerStep cart={cart} onAdd={addToCart} onDone={() => setStep('cart')} />}
              {step === 'manual' && <ManualStep cart={cart} onAdd={addToCart} onDone={() => setStep('cart')} />}
              {step === 'cart' && (
                <CartStep cart={cart} customer={customer}
                  onUpdateQty={(id, d) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))}
                  onRemove={id => setCart(prev => prev.filter(i => i.product.id !== id))}
                  onProceed={handleProceed} onBack={() => setStep('mode')} />
              )}
              {step === 'receipt' && receipt && <ReceiptStep receipt={receipt} onNew={() => { setStep('customer'); setCustomer(null); setCart([]); setReceipt(null); }} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
