
import { Sale } from '../../types/schema';

export const useSalesData = (sales: Sale[]) => {
  // Get sale by ID
  const getSaleById = (id: string) => {
    return sales.find(sale => sale.id === id);
  };

  // Get sales by customer ID
  const getSalesByCustomerId = (customerId: string) => {
    return sales.filter(sale => sale.customer_id === customerId);
  };

  // Get sales by device ID
  const getSalesByDeviceId = (deviceId: string) => {
    return sales.filter(sale => sale.device_id === deviceId);
  };

  // Get sales by device model
  const getSalesByModel = () => {
    const modelMap = new Map();
    
    sales.forEach(sale => {
      const deviceId = sale.device_id;
      // This depends on the integration with the devices hook
      // You would typically get the device model from the device ID
      // For now, we'll just use the device ID as a placeholder
      const model = deviceId;
      
      if (modelMap.has(model)) {
        modelMap.set(model, modelMap.get(model) + 1);
      } else {
        modelMap.set(model, 1);
      }
    });
    
    return Array.from(modelMap.entries()).map(([model, count]) => ({
      model,
      count
    }));
  };

  return {
    getSaleById,
    getSalesByCustomerId,
    getSalesByDeviceId,
    getSalesByModel
  };
};
