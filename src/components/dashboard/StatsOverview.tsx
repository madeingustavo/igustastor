
import React from 'react';
import { Package, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDevices } from '../../hooks/useDevices';
import { useSales } from '../../hooks/useSales';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettings } from '../../hooks/useSettings';

export const StatsOverview: React.FC = () => {
  const { 
    getAvailableDevicesCount,
    getTotalInventoryValue,
    getPotentialSalesValue,
    getPotentialProfit
  } = useDevices();
  
  const {
    getTodayRevenue,
    getTodayProfit,
    getMonthlyRevenue,
    getMonthlyProfit
  } = useSales();
  
  const {
    getTodayExpensesTotal,
    getMonthlyExpensesTotal
  } = useExpenses();
  
  const { formatCurrency } = useSettings();
  
  // Calculate net profit (revenue - expenses)
  const netTodayProfit = getTodayProfit() - getTodayExpensesTotal();
  const netMonthlyProfit = getMonthlyProfit() - getMonthlyExpensesTotal();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Estoque Disponível
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{getAvailableDevicesCount()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor: {formatCurrency(getTotalInventoryValue())}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lucro Estimado
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{formatCurrency(getPotentialProfit())}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Vendas potenciais: {formatCurrency(getPotentialSalesValue())}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lucro Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{formatCurrency(netTodayProfit)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Receita: {formatCurrency(getTodayRevenue())}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Lucro Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{formatCurrency(netMonthlyProfit)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Receita: {formatCurrency(getMonthlyRevenue())}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
