
import React, { useState } from 'react';
import { Device } from '../types/schema';
import { useSettings } from '../hooks/useSettings';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { useDevices } from '../hooks/useDevices';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import SaleFormContainer from './sales/SaleFormContainer';

interface SellDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SellDeviceDialog: React.FC<SellDeviceDialogProps> = ({ 
  device, 
  open, 
  onOpenChange 
}) => {
  const { formatCurrency } = useSettings();
  const { customers, addCustomer } = useCustomers();
  const { addSale } = useSales();
  const { updateDevice } = useDevices();
  const [useExistingCustomer, setUseExistingCustomer] = useState(false);
  
  const form = useForm({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerId: '',
      salePrice: device?.sale_price || 0,
      saleDate: new Date(),
      paymentMethod: 'cash'
    }
  });

  if (!device) return null;

  const calculateProfit = () => {
    const salePrice = form.watch('salePrice');
    return salePrice - device.purchase_price;
  };

  const onSubmit = (data: any) => {
    // Create or use existing customer
    let customerId = data.customerId;
    
    if (!useExistingCustomer) {
      // Create new customer
      const newCustomer = addCustomer({
        name: data.customerName,
        phone: data.customerPhone,
        email: '',
        address: '',
        notes: `Cliente criado durante venda do dispositivo ${device.model}`
      });
      customerId = newCustomer.id;
    }
    
    // Mark device as sold
    updateDevice(device.id, { status: 'sold' });
    
    // Create sale record
    addSale({
      device_id: device.id,
      customer_id: customerId,
      sale_price: data.salePrice,
      profit: calculateProfit(),
      sale_date: data.saleDate.toISOString(),
      payment_method: data.paymentMethod,
      status: 'completed'
    });
    
    toast.success('Venda registrada com sucesso!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SaleFormContainer
        device={device}
        form={form}
        useExistingCustomer={useExistingCustomer}
        setUseExistingCustomer={setUseExistingCustomer}
        customers={customers}
        formatCurrency={formatCurrency}
        calculateProfit={calculateProfit}
        onSubmit={onSubmit}
        onCancel={() => onOpenChange(false)}
      />
    </Dialog>
  );
};

export default SellDeviceDialog;
