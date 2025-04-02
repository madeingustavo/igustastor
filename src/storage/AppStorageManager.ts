
import { StorageManager } from './StorageManager';
import type { Device, Sale, Customer, Supplier, Expense } from '../types/schema';

// Keys for local storage
export const STORAGE_KEYS = {
  DEVICES: 'devices',
  SALES: 'sales',
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  EXPENSES: 'expenses',
  SETTINGS: 'settings'
};

// Define type-safe interface for default data
interface DefaultDataType {
  [STORAGE_KEYS.DEVICES]: Device[];
  [STORAGE_KEYS.SALES]: Sale[];
  [STORAGE_KEYS.CUSTOMERS]: Customer[];
  [STORAGE_KEYS.SUPPLIERS]: Supplier[];
  [STORAGE_KEYS.EXPENSES]: Expense[];
  [STORAGE_KEYS.SETTINGS]: {
    theme: string;
    lowStockAlert: number;
    currency: string;
  };
}

// Default data for each collection with proper types
const DEFAULT_DATA: DefaultDataType = {
  [STORAGE_KEYS.DEVICES]: [] as Device[],
  [STORAGE_KEYS.SALES]: [] as Sale[],
  [STORAGE_KEYS.CUSTOMERS]: [] as Customer[],
  [STORAGE_KEYS.SUPPLIERS]: [] as Supplier[],
  [STORAGE_KEYS.EXPENSES]: [] as Expense[],
  [STORAGE_KEYS.SETTINGS]: {
    theme: 'light',
    lowStockAlert: 5,
    currency: 'BRL'
  }
};

// Application-specific storage manager
export class AppStorageManager {
  // Get data with type safety
  static getDevices(): Device[] {
    return StorageManager.get<Device[]>(STORAGE_KEYS.DEVICES, DEFAULT_DATA[STORAGE_KEYS.DEVICES]);
  }

  static getSales(): Sale[] {
    return StorageManager.get<Sale[]>(STORAGE_KEYS.SALES, DEFAULT_DATA[STORAGE_KEYS.SALES]);
  }

  static getCustomers(): Customer[] {
    return StorageManager.get<Customer[]>(STORAGE_KEYS.CUSTOMERS, DEFAULT_DATA[STORAGE_KEYS.CUSTOMERS]);
  }

  static getSuppliers(): Supplier[] {
    return StorageManager.get<Supplier[]>(STORAGE_KEYS.SUPPLIERS, DEFAULT_DATA[STORAGE_KEYS.SUPPLIERS]);
  }

  static getExpenses(): Expense[] {
    return StorageManager.get<Expense[]>(STORAGE_KEYS.EXPENSES, DEFAULT_DATA[STORAGE_KEYS.EXPENSES]);
  }

  static getSettings(): any {
    return StorageManager.get(STORAGE_KEYS.SETTINGS, DEFAULT_DATA[STORAGE_KEYS.SETTINGS]);
  }

  // Save data with type safety
  static saveDevices(devices: Device[]): void {
    StorageManager.save(STORAGE_KEYS.DEVICES, devices);
  }

  static saveSales(sales: Sale[]): void {
    StorageManager.save(STORAGE_KEYS.SALES, sales);
  }

  static saveCustomers(customers: Customer[]): void {
    StorageManager.save(STORAGE_KEYS.CUSTOMERS, customers);
  }

  static saveSuppliers(suppliers: Supplier[]): void {
    StorageManager.save(STORAGE_KEYS.SUPPLIERS, suppliers);
  }

  static saveExpenses(expenses: Expense[]): void {
    StorageManager.save(STORAGE_KEYS.EXPENSES, expenses);
  }

  static saveSettings(settings: any): void {
    StorageManager.save(STORAGE_KEYS.SETTINGS, settings);
  }

  // Backup and restore functionality
  static exportData(): void {
    const data = {
      devices: this.getDevices(),
      sales: this.getSales(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      expenses: this.getExpenses(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iphone-sales-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async importData(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate backup structure
      const requiredKeys = ['devices', 'sales', 'customers', 'suppliers', 'expenses'];
      if (!requiredKeys.every(key => key in data)) {
        throw new Error('Invalid backup file format');
      }
      
      // Import all data with proper type assertions
      if (data.devices) this.saveDevices(data.devices as Device[]);
      if (data.sales) this.saveSales(data.sales as Sale[]);
      if (data.customers) this.saveCustomers(data.customers as Customer[]);
      if (data.suppliers) this.saveSuppliers(data.suppliers as Supplier[]);
      if (data.expenses) this.saveExpenses(data.expenses as Expense[]);
      if (data.settings) this.saveSettings(data.settings);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}
