
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';
import { Customer } from '@/types/schema';
import { UseFormReturn } from 'react-hook-form';

interface CustomerSelectionFormProps {
  form: UseFormReturn<any>;
  useExistingCustomer: boolean;
  setUseExistingCustomer: (value: boolean) => void;
  customers: Customer[];
}

const CustomerSelectionForm: React.FC<CustomerSelectionFormProps> = ({
  form,
  useExistingCustomer,
  setUseExistingCustomer,
  customers
}) => {
  return (
    <>
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
    </>
  );
};

export default CustomerSelectionForm;
