import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Search, Plus, Edit2, AlertTriangle, X, ChevronDown, CheckCircle } from 'lucide-react';
import { PRODUCTS, Product, formatCurrency } from './mockData';

const BG = '#000000';
const CARD = '#121212';
const INNER = '#0a0a0a';
const TEXT = '#F8FAFC';
const MUTED = '#94A3B8';
const card = { background: CARD, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 24px rgba(0,0,0,0.45)' };

const CATEGORIES = ['Lahat', 'Staples', 'Cooking', 'Canned Goods', 'Personal Care', 'Beverages', 'Noodles', 'Snacks', 'Tobacco', 'Household', 'Condiments'];

function AddStockModal({ product, onClose, onConfirm }: {
  product: Product; onClose: () => void; onConfirm: (qty: number) => void;
}) {
  const [qty, setQty] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="w-full max-w-sm rounded-3xl p-7"
        style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{product.icon}</span>
            <div>
              <div style={{ color: TEXT, fontSize: 15, fontWeight: 700 }}>{product.name}</div>
              <div style={{ color: MUTED, fontSize: 12 }}>Current stock: {product.stock} units</div>
            </div>
          </div>
          <button onClick={onClose}><X size={18} color={MUTED} /></button>
        </div>

        <label style={{ color: MUTED, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Dagdag na Stock
        </label>
        <input
          type="number" value={qty} onChange={e => setQty(e.target.value)}
          placeholder="0" autoFocus
          className="w-full mt-2 px-4 py-4 rounded-2xl outline-none text-center"
          style={{ background: INNER, color: TEXT, fontSize: 28, fontWeight: 900, border: '1.5px solid rgba(255,255,255,0.08)' }}
          onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#1800ad'}
          onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        <div className="flex gap-2.5 mt-5">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl transition-colors" style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.1)', color: MUTED, fontSize: 14 }}>
            Ikansela
          </button>
          <button
            onClick={() => { const n = parseInt(qty); if (n > 0) onConfirm(n); }}
            className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            style={{ background: '#10B981', color: '#000', fontSize: 14, fontWeight: 700 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#059669'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#10B981'}
          >
            <CheckCircle size={16} /> I-dagdag ang Stock
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Inventory() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Lahat');
  const [addingStock, setAddingStock] = useState<Product | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = products
    .filter(p => category === 'Lahat' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStockItems = products.filter(p => p.stock < 100);

  const handleAddStock = (qty: number) => {
    if (!addingStock) return;
    setProducts(prev => prev.map(p => p.id === addingStock.id ? { ...p, stock: p.stock + qty } : p));
    setSuccessMsg(`+${qty} units idagdag sa ${addingStock.name}`);
    setAddingStock(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden p-6 gap-4" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 style={{ color: TEXT, fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>Inventory</h1>
          <p style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>Stock management at product catalog</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-colors"
          style={{ background: '#1800ad', color: '#fff', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 20px rgba(24,0,173,0.4)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#150f9e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1800ad'}
        >
          <Plus size={15} /> Bagong Produkto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {[
          { label: 'Total SKUs', value: `${products.length} items`, icon: Package, color: '#1800ad' },
          { label: 'Inventory Value', value: formatCurrency(totalValue), icon: Package, color: '#10B981' },
          { label: 'Low Stock Alert', value: `${lowStockItems.length} items`, icon: AlertTriangle, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5" style={card}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}12` }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ color, fontSize: 17, fontWeight: 900 }}>{value}</div>
            <div style={{ color: MUTED, fontSize: 11, fontWeight: 500, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1">
          <Search size={14} color={MUTED} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Hanapin ang produkto o SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl outline-none"
            style={{ background: CARD, color: TEXT, border: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}
          />
        </div>
        <div className="relative">
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl outline-none cursor-pointer"
            style={{ background: CARD, color: TEXT, border: '1px solid rgba(255,255,255,0.06)', fontSize: 13 }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} color={MUTED} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <CheckCircle size={15} color="#10B981" />
            <span style={{ color: '#10B981', fontSize: 13, fontWeight: 600 }}>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column headers */}
      <div
        className="shrink-0 grid items-center px-5 py-2.5 rounded-xl"
        style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 120px', background: INNER, border: '1px solid rgba(255,255,255,0.04)' }}
      >
        {['Produkto', 'SKU', 'Kategorya', 'Stock', 'Presyo', 'Aksyon'].map(h => (
          <div key={h} style={{ color: MUTED, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</div>
        ))}
      </div>

      {/* Product rows */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
        <AnimatePresence>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: i * 0.025 }}
              className="grid items-center px-5 py-3.5 rounded-2xl transition-colors cursor-pointer"
              style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 120px', background: CARD, border: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1a1a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = CARD}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl shrink-0">{p.icon}</span>
                <div className="min-w-0">
                  <div style={{ color: TEXT, fontSize: 12, fontWeight: 600 }} className="truncate">{p.name}</div>
                </div>
              </div>
              <div style={{ color: MUTED, fontSize: 11, fontFamily: 'monospace' }}>{p.sku}</div>
              <div>
                <span className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: MUTED, fontSize: 11 }}>
                  {p.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: p.stock < 100 ? '#F59E0B' : '#10B981', fontSize: 13, fontWeight: 800 }}>{p.stock}</span>
                {p.stock < 100 && (
                  <span className="px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontSize: 9, fontWeight: 800 }}>LOW</span>
                )}
              </div>
              <div style={{ color: TEXT, fontSize: 13, fontWeight: 800 }}>{formatCurrency(p.price)}</div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setAddingStock(p)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
                  style={{ background: '#10B981', color: '#000', fontSize: 11, fontWeight: 700 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#059669'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#10B981'}
                >
                  <Plus size={11} /> Stock
                </button>
                <button
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: 'transparent', border: '1.5px solid rgba(24,0,173,0.3)', color: '#818cf8' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(24,0,173,0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <Edit2 size={11} color="#818cf8" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package size={40} color="#222" />
            <p style={{ color: MUTED, fontSize: 14 }}>Walang nahanap na produkto</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {addingStock && (
          <AddStockModal product={addingStock} onClose={() => setAddingStock(null)} onConfirm={handleAddStock} />
        )}
      </AnimatePresence>
    </div>
  );
}
