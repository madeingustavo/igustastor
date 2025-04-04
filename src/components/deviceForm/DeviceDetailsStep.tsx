
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FormValues } from './types';
import { CONDITION_OPTIONS } from '../../utils/deviceConstants';
import StepNavigation from './StepNavigation';
import { toast } from 'sonner';

interface DeviceDetailsStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
  setCurrentStep: (step: 'model') => void;
  suppliers: { id: string; name: string }[];
}

const DeviceDetailsStep: React.FC<DeviceDetailsStepProps> = ({ 
  onPrevious, 
  onSubmit,
  setCurrentStep,
  suppliers
}) => {
  const form = useFormContext<FormValues>();
  const model = form.watch('model');
  const color = form.watch('color');
  const storage = form.watch('storage');

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-2">Especificações selecionadas</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Modelo</p>
            <p className="font-medium">{model}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cor</p>
            <div className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full bg-yellow-400 mr-2"></span>
              <p className="font-medium">{color}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Armazenamento</p>
            <p className="font-medium">{storage}</p>
          </div>
        </div>
        <div className="mt-2 text-right">
          <Button 
            variant="link" 
            onClick={() => setCurrentStep('model')}
            className="text-blue-500 p-0"
          >
            Alterar especificações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
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
      </div>

      <FormField
        control={form.control}
        name="has_apple_warranty"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 space-y-0 mt-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-normal">Possui garantia da Apple</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Adicione observações sobre o dispositivo"
                className="resize-none h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StepNavigation 
        currentStep="details" 
        onNext={() => {}} 
        onPrevious={onPrevious} 
        onSubmit={onSubmit}
        isSubmitVisible={true}
      />
    </div>
  );
};

export default DeviceDetailsStep;
