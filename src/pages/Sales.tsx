
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSales } from '../hooks/useSales';
import { useCustomers } from '../hooks/useCustomers';
import { useDevices } from '../hooks/useDevices';
import { useSettings } from '../hooks/useSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Calendar, MoreHorizontal, Eye, Trash, RefreshCw, Search, X, Phone, ChevronRight } from 'lucide-react';
import SaleDetailsDialog from '../components/SaleDetailsDialog';
import { Sale, Device } from '../types/schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Sales = () => {
  const { sales, removeSale } = useSales();
  const { getCustomerById } = useCustomers();
  const { getDeviceById } = useDevices();
  const { formatCurrency } = useSettings();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeFilter, setTimeFilter] = useState('current-month');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  
  // Filter sales based on search term and filters
  const filteredSales = sales.filter(sale => {
    // Filter by search term
    if (searchTerm) {
      const device = getDeviceById(sale.device_id);
      const customer = getCustomerById(sale.customer_id);
      const deviceMatches = device && device.model.toLowerCase().includes(searchTerm.toLowerCase());
      const customerMatches = customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const imeiMatches = device && (device.imei1?.includes(searchTerm) || device.imei2?.includes(searchTerm));
      
      if (!deviceMatches && !customerMatches && !imeiMatches) {
        return false;
      }
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
    }
    
    return true;
  });
  
  // Calculate summary metrics
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.sale_price, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
  const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // View sale details
  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowSaleDetails(true);
  };
  
  // Delete sale
  const handleDeleteSale = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      removeSale(id);
    }
  };
  
  // Cancel sale (mark as cancelled)
  const handleCancelSale = (id: string) => {
    // This would typically update the sale status to 'cancelled'
    if (window.confirm('Tem certeza que deseja cancelar esta venda?')) {
      // Implementation would depend on your business logic
      alert('Funcionalidade de cancelamento será implementada em breve.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Vendas</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <h3 className="text-xs md:text-sm text-gray-500">Total de Vendas</h3>
            <p className="text-xl md:text-2xl font-bold">{totalSales}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <h3 className="text-xs md:text-sm text-gray-500">Valor Médio</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(averagePrice)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <h3 className="text-xs md:text-sm text-gray-500">Receita Total</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <h3 className="text-xs md:text-sm text-gray-500">Lucro Total</h3>
            <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalProfit)}</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por nome, modelo, IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {!isMobile && (
            <div className="w-full md:w-52">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button 
              variant={timeFilter === 'current-month' ? 'default' : 'outline'} 
              onClick={() => setTimeFilter('current-month')}
              className="whitespace-nowrap"
              size={isMobile ? "sm" : "default"}
            >
              Mês Atual
            </Button>
            <Button 
              variant={timeFilter === 'last-7-days' ? 'default' : 'outline'} 
              onClick={() => setTimeFilter('last-7-days')}
              className="whitespace-nowrap"
              size={isMobile ? "sm" : "default"}
            >
              7 dias
            </Button>
            <Button 
              variant={timeFilter === 'last-30-days' ? 'default' : 'outline'} 
              onClick={() => setTimeFilter('last-30-days')}
              className="whitespace-nowrap"
              size={isMobile ? "sm" : "default"}
            >
              30 dias
            </Button>
            {!isMobile && (
              <>
                <Button variant="default" className="bg-black text-white whitespace-nowrap">
                  Todo o Período
                </Button>
                <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  Selecionar Intervalo
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Sales List */}
        {isMobile && (
          <div className="space-y-3 mb-6">
            {filteredSales.length === 0 ? (
              <div className="text-center py-8 bg-card border rounded-lg">
                <p className="text-muted-foreground">Nenhuma venda encontrada</p>
              </div>
            ) : (
              filteredSales.map((sale) => {
                const device = getDeviceById(sale.device_id);
                const customer = getCustomerById(sale.customer_id);
                
                return (
                  <Card key={sale.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 border-b flex justify-between items-center">
                        <div>
                          <div className="font-medium">{device?.model || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{formatCurrency(sale.sale_price)}</div>
                          <div className="text-sm text-green-600">
                            +{formatCurrency(sale.profit)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Cliente:</span>
                          <span className="font-medium">{customer?.name || 'N/A'}</span>
                        </div>
                        
                        {customer?.phone && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Contato:</span>
                            <a 
                              href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-green-600"
                            >
                              <Phone size={14} className="mr-1" />
                              {customer.phone}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">IMEI:</span>
                          <span className="font-mono text-sm">{device?.imei1 || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 pt-0 flex justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewDetails(sale)}
                        >
                          <Eye size={16} className="mr-2" />
                          Detalhes
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCancelSale(sale.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Cancelar venda
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteSale(sale.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
        
        {/* Desktop Sales Table */}
        {!isMobile && (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>IMEI</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Nenhuma venda encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => {
                    const device = getDeviceById(sale.device_id);
                    const customer = getCustomerById(sale.customer_id);
                    
                    return (
                      <TableRow key={sale.id}>
                        <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                        <TableCell>{device?.model || 'N/A'}</TableCell>
                        <TableCell>{device?.imei1 || 'N/A'}</TableCell>
                        <TableCell>{customer?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {customer?.phone && (
                            <a 
                              href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-green-600"
                            >
                              {customer.phone}
                            </a>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(sale.sale_price)}</TableCell>
                        <TableCell className="text-green-600">
                          {formatCurrency(sale.profit)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(sale)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancelSale(sale.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Cancelar venda
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteSale(sale.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Sale Details Dialog */}
        <SaleDetailsDialog
          sale={selectedSale}
          open={showSaleDetails}
          onOpenChange={setShowSaleDetails}
          onCancelSale={handleCancelSale}
          onDeleteSale={handleDeleteSale}
        />
      </div>
    </Layout>
  );
};

export default Sales;
