
import { Sale } from '../../types/schema';
import { format, subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const useSalesCharts = (sales: Sale[]) => {
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

  return {
    getSalesChartData,
    getMonthlyBillingData
  };
};
