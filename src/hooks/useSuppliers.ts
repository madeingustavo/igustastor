
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Supplier } from '../types/schema';
import { toast } from 'sonner';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(AppStorageManager.getSuppliers());
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  // Sync with localStorage whenever suppliers change
  useEffect(() => {
    AppStorageManager.saveSuppliers(suppliers);
  }, [suppliers]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new supplier
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'created_date'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: generateId(),
      created_date: new Date().toISOString()
    };

    setSuppliers(prev => [...prev, newSupplier]);
    toast.success(`Fornecedor ${newSupplier.name} adicionado com sucesso!`);
    return newSupplier;
  };

  // Update an existing supplier
  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === id 
          ? { ...supplier, ...supplierData } 
          : supplier
      )
    );
    toast.success('Fornecedor atualizado com sucesso!');
  };

  // Remove a supplier
  const removeSupplier = (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;
    
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    toast.info(`Fornecedor ${supplier.name} removido.`);
  };

  // Remove multiple suppliers
  const removeMultipleSuppliers = (ids: string[]) => {
    if (ids.length === 0) return;
    
    setSuppliers(prev => prev.filter(supplier => !ids.includes(supplier.id)));
    toast.info(`${ids.length} fornecedor(es) removidos.`);
    setSelectedSuppliers([]);
  };

  // Toggle supplier selection
  const toggleSupplierSelection = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) ? prev.filter(supplierId => supplierId !== id) : [...prev, id]
    );
  };

  // Select all suppliers
  const selectAllSuppliers = () => {
    if (selectedSuppliers.length === suppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(suppliers.map(supplier => supplier.id));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedSuppliers([]);
  };

  // Get supplier by ID
  const getSupplierById = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  // Get all suppliers (sorted by name)
  const getAllSuppliers = () => {
    return [...suppliers].sort((a, b) => a.name.localeCompare(b.name));
  };

  // Search suppliers
  const searchSuppliers = (query: string) => {
    if (!query.trim()) return getAllSuppliers();
    
    const searchTerm = query.toLowerCase().trim();
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchTerm) ||
      supplier.phone.includes(searchTerm)
    );
  };

  return {
    suppliers,
    selectedSuppliers,
    addSupplier,
    updateSupplier,
    removeSupplier,
    removeMultipleSuppliers,
    toggleSupplierSelection,
    selectAllSuppliers,
    clearSelection,
    getSupplierById,
    getAllSuppliers,
    searchSuppliers
  };
};
