
import React from 'react';
import { Form } from '@/components/ui/form';
import { DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import DeviceSummary from './DeviceSummary';
import CustomerSelectionForm from './CustomerSelectionForm';
import PaymentDetailsForm from './PaymentDetailsForm';
import { Device, Customer } from '@/types/schema';

interface SaleFormContainerProps {
  device: Device;
  form: UseFormReturn<any>;
  useExistingCustomer: boolean;
  setUseExistingCustomer: (value: boolean) => void;
  customers: Customer[];
  formatCurrency: (value: number) => string;
  calculateProfit: () => number;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SaleFormContainer: React.FC<SaleFormContainerProps> = ({
  device,
  form,
  useExistingCustomer,
  setUseExistingCustomer,
  customers,
  formatCurrency,
  calculateProfit,
  onSubmit,
  onCancel
}) => {
  return (
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Registrar Venda
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default SaleFormContainer;
