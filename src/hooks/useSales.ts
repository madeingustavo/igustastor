
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Sale } from '../types/schema';
import { toast } from 'sonner';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>(AppStorageManager.getSales());

  // Sync with localStorage whenever sales change
  useEffect(() => {
    AppStorageManager.saveSales(sales);
  }, [sales]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new sale
  const addSale = (saleData: Omit<Sale, 'id' | 'created_date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: generateId(),
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
    getSalesChartData
  };
};
