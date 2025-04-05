import React, { useState } from 'react';
import { Device } from '../types/schema';
import { useSettings } from '../hooks/useSettings';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { useDevices } from '../hooks/useDevices';
import { generateId } from '../utils/idGenerator';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { CalendarIcon, X, User } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SellDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Rest of the component remains largely the same, with key modifications to handle the new customer ID
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
      // Create new customer with consistent ID format
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
    
    // Create sale record with consistent ID format
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

  // Rest of the component remains the same...
  // ... keep existing code (form rendering, UI elements, etc.)

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
        
        <div className="py-2">
          <h3 className="font-medium text-lg">{device.model} {device.storage}</h3>
          <p className="text-sm text-muted-foreground">IMEI: {device.imei1 || 'N/A'}</p>
          <p className="text-sm text-muted-foreground">Preço de compra: {formatCurrency(device.purchase_price)}</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="useExistingCustomer" 
                checked={useExistingCustomer}
                onCheckedChange={(checked) => setUseExistingCustomer(checked as boolean)}
              />
              <label
                htmlFor="useExistingCustomer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Usar cliente existente
              </label>
            </div>

            {useExistingCustomer ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.length > 0 ? (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} - {customer.phone}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-customers">Nenhum cliente cadastrado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Comprador</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Nome completo" {...field} />
                          <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="saleDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Venda</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal flex justify-between"
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="transfer">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between py-2">
              <span className="font-medium">Lucro Estimado:</span>
              <span className="text-green-600 font-semibold">
                {formatCurrency(calculateProfit())}
              </span>
            </div>
            
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
