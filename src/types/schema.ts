
// Define TypeScript interfaces for all data entities

export type EntityType = 'device' | 'customer' | 'sale' | 'expense';
export type DeviceStatus = 'available' | 'sold' | 'reserved';
export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'pix' | 'transfer';
export type SaleStatus = 'completed' | 'pending' | 'cancelled';

export interface Device {
  id: string;  // Formato: DEV-TIMESTAMP-RANDOM
  model: string;
  storage: string;
  color: string;
  condition: string;
  purchase_price: number;
  sale_price: number;
  supplier_id: string;
  status: DeviceStatus;
  serial_number: string;
  notes: string;
  created_date: string;
  original_date?: string;
  _exact_original_date?: string;
  
  // Technical fields
  imei1?: string;
  imei2?: string;
  battery_health?: string;
  has_apple_warranty?: boolean;
  warranty_date?: string;
  purchase_date?: string;
}

export interface Sale {
  id: string;  // Formato: SAL-TIMESTAMP-RANDOM
  device_id: string;
  customer_id: string;
  sale_price: number;
  profit: number;
  sale_date: string;
  created_date: string;
  payment_method: PaymentMethod;
  status: SaleStatus;
}

export interface Customer {
  id: string;  // Formato: CLI-TIMESTAMP-RANDOM
  name: string;
  email: string;
  phone: string;
  address: string;
  created_date: string;
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_date: string;
  notes: string;
}

export interface Expense {
  id: string;  // Formato: EXP-TIMESTAMP-RANDOM
  device_id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}
