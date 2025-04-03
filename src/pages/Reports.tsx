
import React, { useState, useEffect } from 'react';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, subMonths, parseISO } from 'date-fns';
import { CalendarIcon, Download, Filter, Search, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { useSales } from '@/hooks/useSales';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useDevices } from '@/hooks/useDevices';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SalesChart } from '@/components/reports/SalesChart';
import { SalesPieChart } from '@/components/reports/SalesPieChart';
import { TopModelsList } from '@/components/reports/TopModelsList';
import { DatePickerWithRange } from '@/components/reports/DatePickerWithRange';
import { DateRange } from 'react-day-picker';

// Date filter options
const DATE_FILTERS = [
  { id: 'current-month', label: 'Mês Atual' },
  { id: 'last-7', label: 'Últimos 7 dias' },
  { id: 'last-30', label: 'Últimos 30 dias' },
  { id: 'all-time', label: 'Todo o Período' },
];

const Reports = () => {
  const { sales, getTotalSalesAmount, getTotalProfit, getMonthlyBillingData } = useSales();
  const { devices, getDeviceById } = useDevices();
  const { suppliers, getSupplierById } = useSuppliers();

  // Filters state
  const [dateFilter, setDateFilter] = useState('current-month');
  const [modelFilter, setModelFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('sales');

  // Filtered sales
  const [filteredSales, setFilteredSales] = useState(sales);
  
  // Computed statistics
  const [totalSales, setTotalSales] = useState(0);
  const [averageValue, setAverageValue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...sales];
    
    // Apply date filter
    if (dateRange && dateRange.from) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        if (dateRange.to) {
          return isWithinInterval(saleDate, { 
            start: dateRange.from, 
            end: dateRange.to 
          });
        } else {
          return saleDate >= dateRange.from;
        }
      });
    } else {
      const today = new Date();
      
      switch (dateFilter) {
        case 'current-month':
          const firstDay = startOfMonth(today);
          const lastDay = endOfMonth(today);
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.sale_date);
            return isWithinInterval(saleDate, { start: firstDay, end: lastDay });
          });
          break;
        case 'last-7':
          const sevenDaysAgo = subDays(today, 7);
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.sale_date);
            return saleDate >= sevenDaysAgo;
          });
          break;
        case 'last-30':
          const thirtyDaysAgo = subDays(today, 30);
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.sale_date);
            return saleDate >= thirtyDaysAgo;
          });
          break;
        // all-time: no filter needed
      }
    }
    
    // Apply model filter
    if (modelFilter) {
      filtered = filtered.filter(sale => {
        const device = getDeviceById(sale.device_id);
        return device && device.model.toLowerCase().includes(modelFilter.toLowerCase());
      });
    }
    
    // Apply supplier filter
    if (supplierFilter && supplierFilter !== 'all') {
      filtered = filtered.filter(sale => {
        const device = getDeviceById(sale.device_id);
        return device && device.supplier_id === supplierFilter;
      });
    }
    
    setFilteredSales(filtered);
  }, [sales, dateFilter, dateRange, modelFilter, supplierFilter, getDeviceById]);
  
  // Calculate statistics
  useEffect(() => {
    if (filteredSales.length > 0) {
      setTotalSales(filteredSales.length);
      setAverageValue(
        filteredSales.reduce((sum, sale) => sum + sale.sale_price, 0) / filteredSales.length
      );
      setTotalRevenue(filteredSales.reduce((sum, sale) => sum + sale.sale_price, 0));
      setTotalProfit(filteredSales.reduce((sum, sale) => sum + sale.profit, 0));
    } else {
      setTotalSales(0);
      setAverageValue(0);
      setTotalRevenue(0);
      setTotalProfit(0);
    }
  }, [filteredSales]);
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Data', 'Modelo', 'Fornecedor', 'Preço de Venda', 'Lucro'];
    
    const csvData = filteredSales.map(sale => {
      const device = getDeviceById(sale.device_id);
      const supplier = device ? getSupplierById(device.supplier_id) : null;
      
      return [
        format(new Date(sale.sale_date), 'dd/MM/yyyy'),
        device ? device.model : 'N/A',
        supplier ? supplier.name : 'N/A',
        sale.sale_price.toFixed(2),
        sale.profit.toFixed(2)
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    const fileName = `relatorio-vendas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Group sales by model
  const getSalesByModel = () => {
    const modelMap = new Map();
    
    filteredSales.forEach(sale => {
      const device = getDeviceById(sale.device_id);
      if (device) {
        const model = device.model;
        if (modelMap.has(model)) {
          const current = modelMap.get(model);
          modelMap.set(model, {
            count: current.count + 1,
            revenue: current.revenue + sale.sale_price,
            profit: current.profit + sale.profit
          });
        } else {
          modelMap.set(model, {
            count: 1,
            revenue: sale.sale_price,
            profit: sale.profit
          });
        }
      }
    });
    
    return Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      count: data.count,
      revenue: data.revenue,
      profit: data.profit
    }));
  };

  // Get supplier performance data
  const getSupplierPerformance = () => {
    const supplierMap = new Map();
    
    sales.forEach(sale => {
      const device = getDeviceById(sale.device_id);
      if (device && device.supplier_id) {
        const supplierId = device.supplier_id;
        if (supplierMap.has(supplierId)) {
          const current = supplierMap.get(supplierId);
          supplierMap.set(supplierId, {
            sales: current.sales + 1,
            revenue: current.revenue + sale.sale_price,
            profit: current.profit + sale.profit
          });
        } else {
          supplierMap.set(supplierId, {
            sales: 1,
            revenue: sale.sale_price,
            profit: sale.profit
          });
        }
      }
    });
    
    return Array.from(supplierMap.entries())
      .map(([supplierId, data]) => {
        const supplier = getSupplierById(supplierId);
        return {
          id: supplierId,
          name: supplier ? supplier.name : 'Desconhecido',
          sales: data.sales,
          revenue: data.revenue,
          profit: data.profit,
          profitMargin: (data.profit / data.revenue) * 100
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  };
  
  // Get sales data for charts
  const getChartData = () => {
    const modelData = getSalesByModel();
    
    // For bar chart
    const barChartData = modelData.map(item => ({
      name: item.model,
      Vendas: item.count,
      Receita: item.revenue
    }));
    
    // For pie chart
    const pieChartData = modelData.map(item => ({
      name: item.model,
      value: item.count,
      percentage: ((item.count / totalSales) * 100).toFixed(1)
    }));
    
    // Top 5 models by revenue
    const topModels = [...modelData]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => ({
        model: item.model,
        revenue: item.revenue,
        sales: item.count
      }));
    
    return {
      barChartData,
      pieChartData,
      topModels
    };
  };

  // Get monthly billing data
  const getMonthlySalesData = () => {
    const monthlyData = getMonthlyBillingData();
    
    return monthlyData.map(item => ({
      name: item.month,
      Vendas: item.count,
      Receita: item.revenue,
      Lucro: item.profit
    }));
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <Layout>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar para CSV
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Filtros</CardTitle>
            <p className="text-sm text-muted-foreground">Selecione o período e outros filtros</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {DATE_FILTERS.map(filter => (
                  <Button
                    key={filter.id}
                    variant={dateFilter === filter.id ? "default" : "outline"}
                    onClick={() => {
                      setDateFilter(filter.id);
                      setDateRange(undefined);
                    }}
                    size="sm"
                  >
                    {filter.label}
                  </Button>
                ))}
                <DatePickerWithRange 
                  dateRange={dateRange} 
                  onRangeChange={(range) => {
                    setDateRange(range);
                    setDateFilter('');
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar por Modelo</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Modelo do dispositivo"
                      className="pl-8"
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fornecedor</label>
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os fornecedores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os fornecedores</SelectItem>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageValue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="sales" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="sales">Relatório de Vendas</TabsTrigger>
            <TabsTrigger value="billing">Faturamento Mensal</TabsTrigger>
            <TabsTrigger value="suppliers">Relatório de Fornecedores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            {/* Models Sales Chart */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Vendas por Modelo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full">
                  <SalesChart data={getChartData().barChartData} />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sales Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <SalesPieChart data={getChartData().pieChartData} />
                  </div>
                </CardContent>
              </Card>
              
              {/* Top 5 Models */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Modelos (Receita)</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopModelsList models={getChartData().topModels} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Faturamento Mensal</CardTitle>
                  <p className="text-sm text-muted-foreground">Receita e lucro dos últimos 12 meses</p>
                </div>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] w-full">
                  <SalesChart data={getMonthlySalesData()} />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Faturamento Médio Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      sales.length > 0
                        ? sales.reduce((sum, sale) => sum + sale.sale_price, 0) / 12
                        : 0
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Lucro Médio Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      sales.length > 0
                        ? sales.reduce((sum, sale) => sum + sale.profit, 0) / 12
                        : 0
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Margem de Lucro Média
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sales.length > 0
                      ? `${(
                          (sales.reduce((sum, sale) => sum + sale.profit, 0) /
                            sales.reduce((sum, sale) => sum + sale.sale_price, 0)) *
                          100
                        ).toFixed(1)}%`
                      : '0%'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="suppliers" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Relatório de Fornecedores</CardTitle>
                  <p className="text-sm text-muted-foreground">Desempenho por fornecedor</p>
                </div>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3">Fornecedor</th>
                        <th scope="col" className="px-6 py-3">Vendas</th>
                        <th scope="col" className="px-6 py-3">Receita Total</th>
                        <th scope="col" className="px-6 py-3">Lucro Total</th>
                        <th scope="col" className="px-6 py-3">Margem de Lucro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSupplierPerformance().map((supplier, index) => (
                        <tr key={supplier.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                          <td className="px-6 py-4 font-medium">{supplier.name}</td>
                          <td className="px-6 py-4">{supplier.sales}</td>
                          <td className="px-6 py-4">{formatCurrency(supplier.revenue)}</td>
                          <td className="px-6 py-4">{formatCurrency(supplier.profit)}</td>
                          <td className="px-6 py-4">{supplier.profitMargin.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Fornecedores por Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getSupplierPerformance().slice(0, 5).map((supplier, index) => (
                      <div key={supplier.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full bg-${['blue', 'green', 'orange', 'red', 'purple'][index % 5]}-500`} />
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-xs text-muted-foreground">{supplier.sales} vendas</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(supplier.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Fornecedores por Margem de Lucro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...getSupplierPerformance()]
                      .sort((a, b) => b.profitMargin - a.profitMargin)
                      .slice(0, 5)
                      .map((supplier, index) => (
                        <div key={supplier.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full bg-${['blue', 'green', 'orange', 'red', 'purple'][index % 5]}-500`} />
                            <div>
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-xs text-muted-foreground">{supplier.profitMargin.toFixed(1)}% margem</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(supplier.profit)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
