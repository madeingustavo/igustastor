
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, QrCode } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormValues } from './types';
import { CONDITION_OPTIONS } from '../../utils/deviceConstants';
import { toast } from 'sonner';

const DeviceConditionFields: React.FC = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <div>
      <FormField
        control={form.control}
        name="battery_health"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Saúde da Bateria *</FormLabel>
            <div className="flex">
              <FormControl>
                <Input placeholder="Ex: 92" {...field} />
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
        name="condition"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Condição</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a condição" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchase_price"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Preço de Compra (R$) *</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchase_date"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Data de Cadastro</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>{format(new Date(), "dd/MM/yyyy")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || new Date()}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DeviceConditionFields;
