
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Customer } from '../types/schema';
import { toast } from 'sonner';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(AppStorageManager.getCustomers());

  // Sync with localStorage whenever customers change
  useEffect(() => {
    AppStorageManager.saveCustomers(customers);
  }, [customers]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new customer
  const addCustomer = (customerData: Omit<Customer, 'id' | 'created_date'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: generateId(),
      created_date: new Date().toISOString()
    };

    setCustomers(prev => [...prev, newCustomer]);
    toast.success(`Cliente ${newCustomer.name} adicionado com sucesso!`);
    return newCustomer;
  };

  // Update an existing customer
  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { ...customer, ...customerData } 
          : customer
      )
    );
    toast.success('Cliente atualizado com sucesso!');
  };

  // Remove a customer
  const removeCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    toast.info(`Cliente ${customer.name} removido.`);
  };

  // Get customer by ID
  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  // Get all customers (sorted by name)
  const getAllCustomers = () => {
    return [...customers].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Search customers
  const searchCustomers = (query: string) => {
    if (!query.trim()) return getAllCustomers();
    
    const searchTerm = query.toLowerCase().trim();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm)
    );
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    removeCustomer,
    getCustomerById,
    getAllCustomers,
    searchCustomers
  };
};
