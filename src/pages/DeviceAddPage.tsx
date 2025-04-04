import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Layout from '../components/Layout';
import { DEVICE_MODEL, DEVICE_STORAGE, DEVICE_COLOR, DEVICE_CONDITION } from '../utils/deviceConstants';
import { useDevices } from '../hooks/useDevices';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSettings } from '../hooks/useSettings';
import { toast } from '@/hooks/use-toast';
import { Device } from '../types/schema';

// Form validation schema
const formSchema = z.object({
  model: z.string().min(1, { message: 'Modelo é obrigatório' }),
  storage: z.string().min(1, { message: 'Armazenamento é obrigatório' }),
  color: z.string().min(1, { message: 'Cor é obrigatória' }),
  condition: z.string().min(1, { message: 'Condição é obrigatória' }),
  purchase_price: z.coerce.number().min(0, { message: 'Preço de compra deve ser maior ou igual a 0' }),
  sale_price: z.coerce.number().min(0, { message: 'Preço de venda deve ser maior ou igual a 0' }),
  supplier_id: z.string().min(1, { message: 'Fornecedor é obrigatório' }),
  serial_number: z.string().optional(),
  notes: z.string().optional(),
  original_date: z.date().optional(),
  imei1: z.string().optional(),
  imei2: z.string().optional(),
  battery_health: z.string().optional(),
  has_apple_warranty: z.boolean().default(false),
  warranty_date: z.date().optional(),
  purchase_date: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DeviceAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDevice, getDeviceById, updateDevice } = useDevices();
  const { suppliers } = useSuppliers();
  const { formatCurrency } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [calculatedProfit, setCalculatedProfit] = useState(0);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: '',
      storage: '',
      color: '',
      condition: 'novo',
      purchase_price: 0,
      sale_price: 0,
      supplier_id: '',
      serial_number: '',
      notes: '',
      imei1: '',
      imei2: '',
      battery_health: '',
      has_apple_warranty: false,
      warranty_date: undefined,
      purchase_date: undefined,
      original_date: undefined,
    },
  });

  // Watch for price changes to calculate profit
  const purchasePrice = form.watch('purchase_price');
  const salePrice = form.watch('sale_price');

  useEffect(() => {
    if (purchasePrice && salePrice) {
      setCalculatedProfit(salePrice - purchasePrice);
    } else {
      setCalculatedProfit(0);
    }
  }, [purchasePrice, salePrice]);

  // Load device data if editing
  useEffect(() => {
    if (id) {
      const device = getDeviceById(id);
      if (device) {
        setIsEditing(true);
        
        // Convert date strings to Date objects for form fields
        let warrantyDate = undefined;
        if (device.warranty_date) {
          warrantyDate = new Date(device.warranty_date);
        }
        
        let purchaseDate = undefined;
        if (device.purchase_date) {
          purchaseDate = new Date(device.purchase_date);
        }
        
        let originalDate = undefined;
        if (device.original_date) {
          originalDate = new Date(device.original_date);
        }
        
        form.reset({
          model: device.model,
          storage: device.storage,
          color: device.color,
          condition: device.condition,
          purchase_price: device.purchase_price,
          sale_price: device.sale_price,
          supplier_id: device.supplier_id,
          serial_number: device.serial_number,
          notes: device.notes,
          imei1: device.imei1 || '',
          imei2: device.imei2 || '',
          battery_health: device.battery_health || '',
          has_apple_warranty: device.has_apple_warranty || false,
          warranty_date: warrantyDate,
          purchase_date: purchaseDate,
          original_date: originalDate,
        });
      } else {
        // If device not found, redirect back to devices list
        navigate('/devices');
        toast({
          title: "Dispositivo não encontrado",
          description: "O dispositivo que você está tentando editar não existe.",
          variant: "destructive",
        });
      }
    }
  }, [id, getDeviceById, navigate, form]);

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    try {
      console.log("Form data submitted:", data);
      
      // Format dates for storage
      const formattedData = {
        ...data,
        warranty_date: data.warranty_date ? data.warranty_date.toISOString() : undefined,
        purchase_date: data.purchase_date ? data.purchase_date.toISOString() : undefined,
        original_date: data.original_date ? data.original_date.toISOString() : undefined,
        _exact_original_date: data.original_date ? format(data.original_date, 'dd/MM/yyyy') : undefined,
      };
      
      if (isEditing && id) {
        // Update existing device
        updateDevice(id, formattedData);
        toast({
          title: "Dispositivo atualizado",
          description: `${data.model} (${data.storage}, ${data.color}) foi atualizado com sucesso.`,
        });
      } else {
        // Add new device
        const newDevice = addDevice(formattedData);
        toast({
          title: "Dispositivo adicionado",
          description: `${data.model} (${data.storage}, ${data.color}) foi adicionado com sucesso.`,
        });
      }
      
      // Redirect to devices list
      navigate('/devices');
    } catch (error) {
      console.error('Error saving device:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar dispositivo",
        description: "Ocorreu um erro ao tentar salvar o dispositivo. Tente novamente.",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Editar Dispositivo' : 'Adicionar Dispositivo'}</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Device Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: iPhone 12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Armazenamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o armazenamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEVICE_STORAGE.map((storage) => (
                            <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEVICE_COLOR.map((color) => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condição</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a condição" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEVICE_CONDITION.map((condition) => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Financial Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Compra</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Lucro Calculado: {formatCurrency(calculatedProfit)}
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o fornecedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="serial_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Série</FormLabel>
                      <FormControl>
                        <Input placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imei1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMEI 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imei2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMEI 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="battery_health"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saúde da Bateria</FormLabel>
                      <FormControl>
                        <Input placeholder="Opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="has_apple_warranty"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Garantia Apple</FormLabel>
                        <FormDescription>
                          O dispositivo possui garantia da Apple?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="warranty_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Garantia</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecionar Data</span>
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
                            disabled={(date) =>
                              date > new Date()
                            }
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
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Compra</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecionar Data</span>
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
                            disabled={(date) =>
                              date > new Date()
                            }
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
                  name="original_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Original</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecionar Data</span>
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
                            disabled={(date) =>
                              date > new Date()
                            }
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
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione notas sobre o dispositivo"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">{isEditing ? 'Atualizar Dispositivo' : 'Adicionar Dispositivo'}</Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default DeviceAddPage;
