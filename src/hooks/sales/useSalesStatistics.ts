
import { Sale } from '../../types/schema';
import { format, isWithinInterval, startOfMonth, endOfMonth, subDays } from 'date-fns';

export const useSalesStatistics = (sales: Sale[]) => {
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

  return {
    getTotalSalesAmount,
    getTotalProfit,
    getTodaySales,
    getTodayRevenue,
    getTodayProfit,
    getMonthlySales,
    getMonthlyRevenue,
    getMonthlyProfit
  };
};
