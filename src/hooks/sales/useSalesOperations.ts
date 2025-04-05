
import { Sale, SaleStatus } from '../../types/schema';
import { generateId, isValidId } from '../../utils/idGenerator';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

export const useSalesOperations = (
  sales: Sale[],
  setSales: Dispatch<SetStateAction<Sale[]>>
) => {
  // Add a new sale
  const addSale = (saleData: Omit<Sale, 'id' | 'created_date'>) => {
    // Validate IDs if using the new ID format
    if (saleData.device_id.includes('-')) {
      if (!isValidId(saleData.device_id, 'device')) {
        toast.error('ID de dispositivo inválido');
        return null;
      }
    }
    
    if (saleData.customer_id.includes('-')) {
      if (!isValidId(saleData.customer_id, 'customer')) {
        toast.error('ID de cliente inválido');
        return null;
      }
    }

    const newSale: Sale = {
      ...saleData,
      id: generateId('sale'),
      created_date: new Date().toISOString()
    };

    setSales(prev => [...prev, newSale]);
    toast.success('Venda registrada com sucesso!');
    return newSale;
  };

  // Update an existing sale
  const updateSale = (id: string, saleData: Partial<Sale>) => {
    setSales(prev => 
      prev.map(sale => 
        sale.id === id 
          ? { ...sale, ...saleData } 
          : sale
      )
    );
    toast.success('Venda atualizada com sucesso!');
  };

  // Remove a sale
  const removeSale = (id: string) => {
    setSales(prev => prev.filter(sale => sale.id !== id));
    toast.info('Venda removida.');
  };

  return {
    addSale,
    updateSale,
    removeSale
  };
};
