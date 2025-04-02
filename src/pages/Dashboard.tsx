
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShoppingBag, DollarSign, TrendingUp, Package, AlertTriangle, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDevices } from '../hooks/useDevices';
import { useSales } from '../hooks/useSales';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const { 
    getTotalInventoryValue, 
    getPotentialSalesValue, 
    getPotentialProfit,
    getAvailableDevicesCount,
    getOldDevices
  } = useDevices();
  
  const {
    getTotalSalesAmount,
    getTotalProfit,
    getTodayRevenue,
    getTodayProfit,
    getMonthlyRevenue,
    getMonthlyProfit,
    getSalesChartData
  } = useSales();
  
  const {
    getTodayExpensesTotal,
    getMonthlyExpensesTotal,
    getExpensesByCategories
  } = useExpenses();
  
  const { formatCurrency } = useSettings();
  
  const chartData = getSalesChartData();
  const expensesByCategory = getExpensesByCategories();
  const oldDevices = getOldDevices();
  
  // Calculate net profit (revenue - expenses)
  const netTodayProfit = getTodayProfit() - getTodayExpensesTotal();
  const netMonthlyProfit = getMonthlyProfit() - getMonthlyExpensesTotal();

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link to="/devices/add">Adicionar Dispositivo</Link>
          </Button>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estoque Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
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
        
        {/* Tabs for different views */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="expenses" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dispositivos Antigos em Estoque</CardTitle>
                <CardDescription>Dispositivos que estão há mais de 30 dias em estoque</CardDescription>
              </CardHeader>
              <CardContent>
                {oldDevices.length > 0 ? (
                  <div className="space-y-4">
                    {oldDevices.map(device => (
                      <div key={device.id} className="flex items-start justify-between p-3 border rounded-md">
                        <div>
                          <h3 className="font-medium">{device.model} ({device.storage}, {device.color})</h3>
                          <p className="text-sm text-muted-foreground">
                            Em estoque desde: {new Date(device.created_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm">
                            Preço: {formatCurrency(device.sale_price)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/devices/${device.id}`}>Ver Detalhes</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Nenhum dispositivo antigo em estoque</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Todos os dispositivos em estoque foram adicionados nos últimos 30 dias.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
