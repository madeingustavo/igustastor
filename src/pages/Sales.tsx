
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSales } from '../hooks/useSales';
import { useSettings } from '../hooks/useSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sale } from '../types/schema';
import SaleDetailsDialog from '../components/SaleDetailsDialog';
import SalesFilters from '../components/sales/SalesFilters';
import SalesSummary from '../components/sales/SalesSummary';
import SalesList from '../components/sales/SalesList';
import SalesTable from '../components/sales/SalesTable';

const Sales = () => {
  const { sales, removeSale, filterSales } = useSales();
  const { formatCurrency } = useSettings();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeFilter, setTimeFilter] = useState('current-month');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  
  // Filter sales based on search term and filters
  const filteredSales = filterSales({
    searchTerm,
    timeFilter,
    dateRange
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
        <SalesSummary 
          totalSales={totalSales}
          averagePrice={averagePrice}
          totalRevenue={totalRevenue}
          totalProfit={totalProfit}
          formatCurrency={formatCurrency}
        />
        
        {/* Filters */}
        <SalesFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          isMobile={isMobile}
        />
        
        {/* Sales list or table based on device */}
        {isMobile ? (
          <SalesList 
            sales={filteredSales}
            formatCurrency={formatCurrency}
            onViewDetails={handleViewDetails}
            onCancelSale={handleCancelSale}
            onDeleteSale={handleDeleteSale}
          />
        ) : (
          <SalesTable
            sales={filteredSales}
            formatCurrency={formatCurrency}
            onViewDetails={handleViewDetails}
            onCancelSale={handleCancelSale}
            onDeleteSale={handleDeleteSale}
          />
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
