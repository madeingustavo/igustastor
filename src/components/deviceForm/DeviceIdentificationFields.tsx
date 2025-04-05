
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QrCode } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FormValues } from './types';
import { parseId } from '../../utils/idGenerator';

interface DeviceIdentificationFieldsProps {
  suppliers: { id: string; name: string }[];
}

const DeviceIdentificationFields: React.FC<DeviceIdentificationFieldsProps> = ({ suppliers }) => {
  const form = useFormContext<FormValues>();
  
  // Display supplier name with ID info if it's using the new format
  const enhanceSupplierDisplay = (supplier: { id: string; name: string }) => {
    const parsedId = parseId(supplier.id);
    if (parsedId) {
      // If new ID format, could show additional info
      return `${supplier.name}`;
    }
    return supplier.name;
  };
  
  return (
    <div>
      <FormField
        control={form.control}
        name="imei1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IMEI 1 *</FormLabel>
            <div className="flex">
              <FormControl>
                <Input placeholder="Ex: 356XXXXXXXXXXXXX" {...field} />
              </FormControl>
              <Button 
                type="button" 
                variant="outline" 
                className="ml-2" 
                onClick={() => toast.info("Funcionalidade de extração automática em desenvolvimento")}
              >
                <QrCode className="h-4 w-4 mr-1" /> Extrair automaticamente
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imei2"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>IMEI 2 *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 357XXXXXXXXXXXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="serial_number"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Número de Série *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: C7GW4XXXXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supplier_id"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Fornecedor *</FormLabel>
            <div className="flex">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {enhanceSupplierDisplay(supplier)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                className="ml-2"
                onClick={() => toast.info("Funcionalidade de adição de fornecedor em desenvolvimento")}
              >
                Novo fornecedor
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeviceIdentificationFields;
