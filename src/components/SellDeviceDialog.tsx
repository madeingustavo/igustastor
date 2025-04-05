
import React, { useState } from 'react';
import { Device } from '../types/schema';
import { useSettings } from '../hooks/useSettings';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { useDevices } from '../hooks/useDevices';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import CustomerSelectionForm from './sales/CustomerSelectionForm';
import PaymentDetailsForm from './sales/PaymentDetailsForm';
import DeviceSummary from './sales/DeviceSummary';

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Venda</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        
        <DeviceSummary device={device} formatCurrency={formatCurrency} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomerSelectionForm 
              form={form}
              useExistingCustomer={useExistingCustomer}
              setUseExistingCustomer={setUseExistingCustomer}
              customers={customers}
            />
            
            <PaymentDetailsForm 
              form={form}
              formatCurrency={formatCurrency}
              calculateProfit={calculateProfit}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Registrar Venda
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SellDeviceDialog;
