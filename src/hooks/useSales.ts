
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Sale, PaymentMethod, SaleStatus } from '../types/schema';
import { generateId } from '../utils/idGenerator';
import { toast } from 'sonner';
import { useSalesData } from './sales/useSalesData';
import { useSalesOperations } from './sales/useSalesOperations';
import { useSalesStatistics } from './sales/useSalesStatistics';
import { useSalesCharts } from './sales/useSalesCharts';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>(AppStorageManager.getSales());

  // Sync with localStorage whenever sales change
  useEffect(() => {
    AppStorageManager.saveSales(sales);
  }, [sales]);

  // Split functionality into separate hooks
  const operations = useSalesOperations(sales, setSales);
  const data = useSalesData(sales);
  const statistics = useSalesStatistics(sales);
  const charts = useSalesCharts(sales);

  return {
    sales,
    ...operations,
    ...data,
    ...statistics,
    ...charts
  };
};
