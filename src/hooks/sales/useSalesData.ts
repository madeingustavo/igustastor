
import { Sale } from '../../types/schema';

interface DateRange {
  from: Date;
  to?: Date;
}

interface FilterOptions {
  searchTerm?: string;
  status?: string;
  timeFilter?: string;
  dateRange?: DateRange;
}

export const useSalesData = (sales: Sale[]) => {
  // Get sale by ID
  const getSaleById = (id: string) => {
    return sales.find(sale => sale.id === id);
  };

  // Get sales by customer ID
  const getSalesByCustomerId = (customerId: string) => {
    return sales.filter(sale => sale.customer_id === customerId);
  };

  // Get sales by device ID
  const getSalesByDeviceId = (deviceId: string) => {
    return sales.filter(sale => sale.device_id === deviceId);
  };

  // Filter sales based on criteria
  const filterSales = ({ 
    searchTerm = '', 
    status = 'all',
    timeFilter = 'all',
    dateRange = { from: new Date(0) }  // Fornecendo um valor padrão para from
  }: FilterOptions) => {
    return sales.filter(sale => {
      // Filter by search term - this would typically search through related entities
      // which would be implemented by passing in device and customer getters
      if (searchTerm) {
        // Basic search - in a real implementation this would check device and customer
        if (!sale.id.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Filter by status
      if (status !== 'all' && sale.status !== status) {
        return false;
      }
      
      // Filter by time period
      const saleDate = new Date(sale.sale_date);
      const now = new Date();
      
      if (timeFilter === 'current-month') {
        const isCurrentMonth = 
          saleDate.getMonth() === now.getMonth() && 
          saleDate.getFullYear() === now.getFullYear();
        if (!isCurrentMonth) return false;
      } else if (timeFilter === 'last-7-days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        if (saleDate < sevenDaysAgo) return false;
      } else if (timeFilter === 'last-30-days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (saleDate < thirtyDaysAgo) return false;
      } else if (timeFilter === 'custom-range') {
        if (dateRange.from && saleDate < dateRange.from) return false;
        if (dateRange.to) {
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (saleDate > endDate) return false;
        }
      }
      
      return true;
    });
  };

  // Get sales by device model
  const getSalesByModel = () => {
    const modelMap = new Map();
    
    sales.forEach(sale => {
      const deviceId = sale.device_id;
      // This depends on the integration with the devices hook
      // You would typically get the device model from the device ID
      // For now, we'll just use the device ID as a placeholder
      const model = deviceId;
      
      if (modelMap.has(model)) {
        modelMap.set(model, modelMap.get(model) + 1);
      } else {
        modelMap.set(model, 1);
      }
    });
    
    return Array.from(modelMap.entries()).map(([model, count]) => ({
      model,
      count
    }));
  };

  return {
    getSaleById,
    getSalesByCustomerId,
    getSalesByDeviceId,
    getSalesByModel,
    filterSales
  };
};
