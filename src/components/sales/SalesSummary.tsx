
import React from 'react';

interface SalesSummaryProps {
  totalSales: number;
  averagePrice: number;
  totalRevenue: number;
  totalProfit: number;
  formatCurrency: (value: number) => string;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  totalSales,
  averagePrice,
  totalRevenue,
  totalProfit,
  formatCurrency
}) => {
  return (
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
  );
};

export default SalesSummary;
