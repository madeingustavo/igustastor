
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useExpenses } from '../../hooks/useExpenses';
import { useSales } from '../../hooks/useSales';
import { useSettings } from '../../hooks/useSettings';

export const ExpensesTab: React.FC = () => {
  const {
    getTodayExpensesTotal,
    getMonthlyExpensesTotal,
    getExpensesByCategories
  } = useExpenses();
  
  const { getMonthlyRevenue, getMonthlyProfit } = useSales();
  const { formatCurrency } = useSettings();

  const expensesByCategory = getExpensesByCategories();

  // Color bullets
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Distribuição de despesas em categorias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                  label={({ category, amount, percent }) => 
                    `${category}: ${formatCurrency(amount)} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Despesas</CardTitle>
            <CardDescription>Totais de despesas por período</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Despesas Hoje</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getTodayExpensesTotal())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium">Despesas Mensais</dt>
                <dd className="text-sm font-semibold">{formatCurrency(getMonthlyExpensesTotal())}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <dt className="text-sm font-medium">Impacto na Rentabilidade</dt>
                <dd className="text-sm font-semibold">
                  {formatCurrency(getMonthlyExpensesTotal() / (getMonthlyRevenue() || 1) * 100)}%
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ações Recomendadas</CardTitle>
            <CardDescription>Sugestões baseadas nos dados de despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expensesByCategory.length > 0 && (
                <li className="text-sm">
                  <span className="font-medium">Maior categoria de despesa:</span>{' '}
                  {expensesByCategory[0].category} ({formatCurrency(expensesByCategory[0].amount)})
                </li>
              )}
              <li className="text-sm">
                <span className="font-medium">Proporção despesas/receita:</span>{' '}
                {((getMonthlyExpensesTotal() / (getMonthlyRevenue() || 1)) * 100).toFixed(1)}%
              </li>
              {getMonthlyExpensesTotal() > getMonthlyProfit() && (
                <li className="text-sm text-red-500 font-medium">
                  Alerta: Despesas mensais excedem o lucro mensal!
                </li>
              )}
              <li className="pt-2 mt-2 border-t">
                <Button asChild size="sm" variant="outline">
                  <Link to="/expenses">Gerenciar Despesas</Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
