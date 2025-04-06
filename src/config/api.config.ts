
// API Configuration 
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/password',
  },
  DEVICES: {
    LIST: '/api/devices',
    AVAILABLE: '/api/devices/available',
    DETAILS: (id: string) => `/api/devices/${id}`,
    CREATE: '/api/devices',
    UPDATE: (id: string) => `/api/devices/${id}`,
    DELETE: (id: string) => `/api/devices/${id}`,
    STATS: '/api/devices/stats',
    IMPORT: '/api/devices/import',
  },
  CUSTOMERS: {
    LIST: '/api/customers',
    SEARCH: '/api/customers/search',
    DETAILS: (id: string) => `/api/customers/${id}`,
    CREATE: '/api/customers',
    UPDATE: (id: string) => `/api/customers/${id}`,
    DELETE: (id: string) => `/api/customers/${id}`,
    STATS: '/api/customers/stats',
    IMPORT: '/api/customers/import',
  },
  SALES: {
    LIST: '/api/sales',
    PENDING: '/api/sales/pending',
    BY_CUSTOMER: (id: string) => `/api/sales/customer/${id}`,
    DETAILS: (id: string) => `/api/sales/${id}`,
    CREATE: '/api/sales',
    UPDATE: (id: string) => `/api/sales/${id}`,
    CANCEL: (id: string) => `/api/sales/${id}/cancel`,
    DELETE: (id: string) => `/api/sales/${id}`,
    STATS: '/api/sales/stats',
  },
  SUPPLIERS: {
    LIST: '/api/suppliers',
    SEARCH: '/api/suppliers/search',
    DETAILS: (id: string) => `/api/suppliers/${id}`,
    CREATE: '/api/suppliers',
    UPDATE: (id: string) => `/api/suppliers/${id}`,
    DELETE: (id: string) => `/api/suppliers/${id}`,
    STATS: '/api/suppliers/stats',
    IMPORT: '/api/suppliers/import',
  },
  EXPENSES: {
    LIST: '/api/expenses',
    DETAILS: (id: string) => `/api/expenses/${id}`,
    CATEGORIES: '/api/expenses/categories',
    CREATE: '/api/expenses',
    UPDATE: (id: string) => `/api/expenses/${id}`,
    DELETE: (id: string) => `/api/expenses/${id}`,
    STATS: '/api/expenses/stats',
    IMPORT: '/api/expenses/import',
  },
  DASHBOARD: {
    SUMMARY: '/api/dashboard/summary',
    SALES_CHART: '/api/dashboard/sales-chart',
    PAYMENT_METHODS_CHART: '/api/dashboard/payment-methods-chart',
    INVENTORY: '/api/dashboard/inventory',
    RECENT_ACTIVITY: '/api/dashboard/recent-activity',
    BUSINESS_INTELLIGENCE: '/api/dashboard/business-intelligence',
  },
};
