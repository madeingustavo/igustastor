
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales } from '../../hooks/useSales';
import { useDevices } from '../../hooks/useDevices';
import { useExpenses } from '../../hooks/useExpenses';
import { useSettings } from '../../hooks/useSettings';

export const SalesTab: React.FC = () => {
  const { 
    getTotalInventoryValue, 
    getPotentialSalesValue, 
    getPotentialProfit,
    getAvailableDevicesCount
  } = useDevices();
  
  const {
    getTotalSalesAmount,
    getTotalProfit,
    getMonthlyProfit,
    getMonthlyRevenue,
    getSalesChartData
  } = useSales();
  
  const { getMonthlyExpensesTotal } = useExpenses();
  const { formatCurrency } = useSettings();
  
  const chartData = getSalesChartData();
  const netMonthlyProfit = getMonthlyProfit() - getMonthlyExpensesTotal();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes (30 dias)</CardTitle>
          <CardDescription>
            Acompanhe o desempenho de vendas nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" name="Receita" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="profit" name="Lucro" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Vendas</CardTitle>
            <CardDescription>Visão geral do desempenho financeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Total Vendido (Sempre)</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getTotalSalesAmount())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Lucro Total</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getTotalProfit())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Lucro Mensal</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getMonthlyProfit())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Despesas Mensais</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getMonthlyExpensesTotal())}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <dt className="text-sm font-medium">Lucro Líquido Mensal</dt>
                <dd className="text-sm font-semibold">{formatCurrency(netMonthlyProfit)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Potencial de Vendas</CardTitle>
            <CardDescription>Valor do estoque atual e lucro projetado</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Dispositivos em Estoque</dt>
                <dd className="text-sm font-semibold">{getAvailableDevicesCount()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Valor do Estoque</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getTotalInventoryValue())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Valor de Venda Projetado</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getPotentialSalesValue())}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <dt className="text-sm font-medium">Lucro Projetado</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getPotentialProfit())}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
