
// Define TypeScript interfaces for all data entities
export interface Device {
  id: string;
  model: string;
  storage: string;
  color: string;
  condition: string;
  purchase_price: number;
  sale_price: number;
  supplier_id: string;
  status: 'available' | 'sold' | 'reserved';
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
  id: string;
  device_id: string;
  customer_id: string;
  sale_price: number;
  profit: number;
  sale_date: string;
  created_date: string;
  payment_method: 'cash' | 'credit' | 'debit' | 'pix' | 'transfer';
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Customer {
  id: string;
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
  id: string;
  device_id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}
