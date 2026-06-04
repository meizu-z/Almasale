export interface Customer {
  id: string;
  name: string;
  balance: number;
  creditLimit: number;
  riskScore: 'good' | 'monitor' | 'high_risk';
  phone: string;
  lastPayment: string;
  daysSincePayment: number;
  address: string;
  tiwaScore: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  icon: string;
  barcode: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  customer: string;
  items: number;
  total: number;
  method: 'cash' | 'gcash' | 'maya' | 'utang';
  time: string;
}

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Maria Santos', balance: 1250, creditLimit: 3000, riskScore: 'monitor', phone: '09171234567', lastPayment: '2026-05-25', daysSincePayment: 7, address: 'Blk 3 Lot 5, Bagong Silang', tiwaScore: 67 },
  { id: 'c2', name: 'Juan dela Cruz', balance: 3500, creditLimit: 3000, riskScore: 'high_risk', phone: '09182345678', lastPayment: '2026-04-30', daysSincePayment: 32, address: 'Purok 2, Dinalupihan', tiwaScore: 22 },
  { id: 'c3', name: 'Ana Reyes', balance: 0, creditLimit: 2500, riskScore: 'good', phone: '09193456789', lastPayment: '2026-05-28', daysSincePayment: 4, address: 'Zone 1, Marisol', tiwaScore: 95 },
  { id: 'c4', name: 'Pedro Bautista', balance: 750, creditLimit: 2000, riskScore: 'good', phone: '09174567890', lastPayment: '2026-05-20', daysSincePayment: 12, address: 'Sitio Mabuhay', tiwaScore: 86 },
  { id: 'c5', name: 'Rosa Mendoza', balance: 5200, creditLimit: 4000, riskScore: 'high_risk', phone: '09185678901', lastPayment: '2026-04-15', daysSincePayment: 47, address: 'Brgy. San Isidro', tiwaScore: 12 },
  { id: 'c6', name: 'Carlo Reyes', balance: 450, creditLimit: 1500, riskScore: 'good', phone: '09196789012', lastPayment: '2026-05-29', daysSincePayment: 3, address: 'Purok 4, San Juan', tiwaScore: 97 },
  { id: 'c7', name: 'Luisa Garcia', balance: 1800, creditLimit: 2000, riskScore: 'monitor', phone: '09177890123', lastPayment: '2026-05-18', daysSincePayment: 14, address: 'Zone 3, Banaba', tiwaScore: 63 },
  { id: 'c8', name: 'Benito Cruz', balance: 2200, creditLimit: 3000, riskScore: 'monitor', phone: '09188901234', lastPayment: '2026-05-10', daysSincePayment: 22, address: 'Brgy. Sto. Niño', tiwaScore: 54 },
  { id: 'c9', name: 'Elena Torres', balance: 0, creditLimit: 1000, riskScore: 'good', phone: '09199012345', lastPayment: '2026-05-30', daysSincePayment: 2, address: 'Purok 1, Bagong Bayan', tiwaScore: 99 },
  { id: 'c10', name: 'Ramon Santos', balance: 4500, creditLimit: 5000, riskScore: 'monitor', phone: '09170123456', lastPayment: '2026-05-05', daysSincePayment: 27, address: 'Blk 7 Lot 2, Phase 2', tiwaScore: 51 },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Ganador Rice (1kg)', sku: 'RIC-001', category: 'Staples', stock: 150, price: 55, icon: '🌾', barcode: '8853762001234' },
  { id: 'p2', name: 'White Sugar (Repacked 1kg)', sku: 'SUG-001', category: 'Staples', stock: 85, price: 68, icon: '🍬', barcode: '8853762002345' },
  { id: 'p3', name: 'Palm Oil 250ml', sku: 'OIL-001', category: 'Cooking', stock: 120, price: 48, icon: '🫙', barcode: '8853762003456' },
  { id: 'p4', name: '555 Sardines (Regular)', sku: 'CAN-001', category: 'Canned Goods', stock: 200, price: 19, icon: '🐟', barcode: '4800561011002' },
  { id: 'p5', name: 'Safeguard White (90g)', sku: 'CRE-001', category: 'Personal Care', stock: 75, price: 44, icon: '🧼', barcode: '6001087379752' },
  { id: 'p6', name: 'Nescafe 3-in-1 (sachet)', sku: 'BEV-001', category: 'Beverages', stock: 300, price: 9, icon: '☕', barcode: '4800194832012' },
  { id: 'p7', name: 'Lucky Me Pancit Canton', sku: 'NOO-001', category: 'Noodles', stock: 180, price: 15, icon: '🍜', barcode: '4800146011116' },
  { id: 'p8', name: 'Chippy (110g)', sku: 'SNK-001', category: 'Snacks', stock: 150, price: 13, icon: '🍟', barcode: '4800016110146' },
  { id: 'p9', name: 'Marlboro Red (pack)', sku: 'TOB-001', category: 'Tobacco', stock: 50, price: 187, icon: '🚬', barcode: '0070000058430' },
  { id: 'p10', name: 'Tide Powder (55g sachet)', sku: 'HOU-001', category: 'Household', stock: 400, price: 8, icon: '🧺', barcode: '6001087028901' },
  { id: 'p11', name: 'Knorr Sinigang Mix (22g)', sku: 'CON-001', category: 'Condiments', stock: 220, price: 12, icon: '🫕', barcode: '8850006001234' },
  { id: 'p12', name: 'Del Monte Ketchup (200g)', sku: 'CON-002', category: 'Condiments', stock: 90, price: 35, icon: '🍅', barcode: '4800014812209' },
];

export const RECENT_SALES: Transaction[] = [
  { id: 't1', customer: 'Maria Santos', items: 3, total: 124, method: 'cash', time: '10:45 AM' },
  { id: 't2', customer: 'Walk-in Customer', items: 5, total: 287, method: 'gcash', time: '10:32 AM' },
  { id: 't3', customer: 'Juan dela Cruz', items: 2, total: 98, method: 'utang', time: '10:18 AM' },
  { id: 't4', customer: 'Walk-in Customer', items: 7, total: 412, method: 'cash', time: '09:55 AM' },
  { id: 't5', customer: 'Ana Reyes', items: 1, total: 55, method: 'maya', time: '09:40 AM' },
  { id: 't6', customer: 'Pedro Bautista', items: 4, total: 203, method: 'cash', time: '09:22 AM' },
  { id: 't7', customer: 'Walk-in Customer', items: 3, total: 145, method: 'cash', time: '09:05 AM' },
  { id: 't8', customer: 'Rosa Mendoza', items: 6, total: 338, method: 'utang', time: '08:50 AM' },
  { id: 't9', customer: 'Carlo Reyes', items: 2, total: 72, method: 'gcash', time: '08:35 AM' },
  { id: 't10', customer: 'Walk-in Customer', items: 9, total: 521, method: 'cash', time: '08:20 AM' },
];

export const DEBT_AGING = [
  { bucket: '0-7 Days', amount: 4500, color: '#10B981' },
  { bucket: '8-30 Days', amount: 8200, color: '#F59E0B' },
  { bucket: '31-60 Days', amount: 5750, color: '#F97316' },
  { bucket: '61+ Days', amount: 3200, color: '#bf0404' },
];

export const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const RISK_CONFIG = {
  good: { label: 'GOOD STANDING', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  monitor: { label: 'MONITOR', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  high_risk: { label: 'HIGH RISK', color: '#bf0404', bg: 'rgba(191,4,4,0.12)' },
};

export const METHOD_CONFIG = {
  cash: { label: 'CASH', color: '#10B981' },
  gcash: { label: 'GCash', color: '#1800ad' },
  maya: { label: 'Maya', color: '#10B981' },
  utang: { label: 'UTANG', color: '#F59E0B' },
};

export const tiwaLabel = (score: number) =>
  score >= 80 ? 'Mahusay' : score >= 50 ? 'Pangkaraniwan' : 'Mapanganib';

export const tiwaColor = (score: number) =>
  score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#bf0404';
