
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Sale } from '../types/schema';
import { generateId, isValidId } from '../utils/idGenerator';
import { toast } from 'sonner';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>(AppStorageManager.getSales());

  // Sync with localStorage whenever sales change
  useEffect(() => {
    AppStorageManager.saveSales(sales);
  }, [sales]);

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

  // Get total sales amount
  const getTotalSalesAmount = () => {
    return sales.reduce((total, sale) => total + sale.sale_price, 0);
  };

  // Get total profit
  const getTotalProfit = () => {
    return sales.reduce((total, sale) => total + sale.profit, 0);
  };

  // Get today's sales
  const getTodaySales = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return format(saleDate, 'yyyy-MM-dd') === todayStr;
    });
  };

  // Get today's revenue
  const getTodayRevenue = () => {
    return getTodaySales().reduce((total, sale) => total + sale.sale_price, 0);
  };

  // Get today's profit
  const getTodayProfit = () => {
    return getTodaySales().reduce((total, sale) => total + sale.profit, 0);
  };

  // Get monthly sales
  const getMonthlySales = () => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return isWithinInterval(saleDate, { 
        start: firstDayOfMonth, 
        end: lastDayOfMonth 
      });
    });
  };

  // Get monthly revenue
  const getMonthlyRevenue = () => {
    return getMonthlySales().reduce((total, sale) => total + sale.sale_price, 0);
  };

  // Get monthly profit
  const getMonthlyProfit = () => {
    return getMonthlySales().reduce((total, sale) => total + sale.profit, 0);
  };

  // Get sales data for chart (last 30 days)
  const getSalesChartData = () => {
    const today = new Date();
    const dailyData = [];
    
    // Create data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Filter sales for this day
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return format(saleDate, 'yyyy-MM-dd') === dateStr;
      });
      
      dailyData.push({
        date: format(date, 'dd/MM'),
        sales: daySales.length,
        revenue: daySales.reduce((total, sale) => total + sale.sale_price, 0),
        profit: daySales.reduce((total, sale) => total + sale.profit, 0)
      });
    }
    
    return dailyData;
  };

  // Get monthly billing data for the last 12 months
  const getMonthlyBillingData = () => {
    const today = new Date();
    const monthlyData = [];
    
    // Create data for the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      // Filter sales for this month
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return isWithinInterval(saleDate, { 
          start: monthStart, 
          end: monthEnd 
        });
      });
      
      monthlyData.push({
        month: format(date, 'MMM/yyyy'),
        count: monthSales.length,
        revenue: monthSales.reduce((total, sale) => total + sale.sale_price, 0),
        profit: monthSales.reduce((total, sale) => total + sale.profit, 0)
      });
    }
    
    return monthlyData;
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
    sales,
    addSale,
    updateSale,
    removeSale,
    getSaleById,
    getSalesByCustomerId,
    getSalesByDeviceId,
    getTotalSalesAmount,
    getTotalProfit,
    getTodaySales,
    getTodayRevenue,
    getTodayProfit,
    getMonthlySales,
    getMonthlyRevenue,
    getMonthlyProfit,
    getSalesChartData,
    getMonthlyBillingData,
    getSalesByModel
  };
};
