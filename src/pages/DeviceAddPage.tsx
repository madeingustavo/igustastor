
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDevices } from '../hooks/useDevices';
import { useSuppliers } from '../hooks/useSuppliers';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ChevronRight, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { IPHONE_MODELS, MODEL_SPECS, CONDITION_OPTIONS } from '../utils/deviceConstants';

// Schema for the form validation
const deviceSchema = z.object({
  model: z.string({ required_error: "Modelo é obrigatório" }),
  color: z.string({ required_error: "Cor é obrigatória" }),
  storage: z.string({ required_error: "Capacidade é obrigatória" }),
  condition: z.string({ required_error: "Estado é obrigatório" }),
  purchase_price: z.number({ required_error: "Preço de compra é obrigatório" }),
  sale_price: z.number({ required_error: "Preço de venda é obrigatório" }),
  supplier_id: z.string({ required_error: "Fornecedor é obrigatório" }),
  imei1: z.string({ required_error: "IMEI principal é obrigatório" }),
  imei2: z.string().optional(),
  serial_number: z.string({ required_error: "Número de série é obrigatório" }),
  battery_health: z.string().optional(),
  has_apple_warranty: z.boolean().default(false),
  warranty_date: z.date().optional().nullable(),
  original_date: z.date(),
  notes: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

const DeviceAddPage = () => {
  const { addDevice } = useDevices();
  const { getAllSuppliers } = useSuppliers();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Store the step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [suppliers, setSuppliers] = useState(getAllSuppliers());
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);

  // Generate a unique device ID
  const generateDeviceId = () => {
    return `DISP_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  };

  // Initialize the form with default values
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      model: '',
      color: '',
      storage: '',
      condition: '10',
      purchase_price: 0,
      sale_price: 0,
      supplier_id: '',
      imei1: '',
      imei2: '',
      serial_number: '',
      battery_health: '100%',
      has_apple_warranty: false,
      warranty_date: null,
      original_date: new Date(),
      notes: '',
    },
  });

  // Watch for model changes to update available colors and storage
  const watchedModel = form.watch('model');
  
  useEffect(() => {
    if (watchedModel && MODEL_SPECS[watchedModel]) {
      setAvailableColors(MODEL_SPECS[watchedModel].colors);
      setAvailableStorage(MODEL_SPECS[watchedModel].storage);
      
      // Reset color and storage if they're not available for this model
      const currentColor = form.getValues('color');
      const currentStorage = form.getValues('storage');
      
      if (currentColor && !MODEL_SPECS[watchedModel].colors.includes(currentColor)) {
        form.setValue('color', '');
      }
      
      if (currentStorage && !MODEL_SPECS[watchedModel].storage.includes(currentStorage)) {
        form.setValue('storage', '');
      }
    } else {
      setAvailableColors([]);
      setAvailableStorage([]);
    }
  }, [watchedModel, form]);

  // Handle form submission
  const onSubmit = (data: DeviceFormValues) => {
    try {
      // Add the device to the database
      const newDevice = addDevice({
        ...data,
        id: generateDeviceId(), // This will be overridden by the hook
        status: 'available',
        _exact_original_date: new Date().toISOString(),
      });
      
      // Show success message
      toast.success('iPhone adicionado com sucesso!');
      
      // Navigate to the device details page
      navigate(`/devices/${newDevice.id}`);
    } catch (error) {
      console.error('Erro ao adicionar iPhone:', error);
      toast.error('Erro ao adicionar iPhone. Tente novamente.');
    }
  };

  // Handle step navigation
  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate basic info fields
      const isValid = await form.trigger(['model', 'color', 'storage', 'condition', 'purchase_price', 'sale_price', 'supplier_id']);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      // Submit the form on the last step
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Adicionar Novo iPhone</h1>
            <p className="text-muted-foreground mt-1">
              Preencha os dados para cadastrar um novo dispositivo
            </p>
          </div>
          <Badge variant="outline" className="text-lg">
            Etapa {currentStep} de 2
          </Badge>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? 'Informações Básicas' : 'Informações Técnicas'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 
                ? 'Preencha as informações básicas do iPhone' 
                : 'Adicione detalhes técnicos e especificações do dispositivo'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o modelo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {IPHONE_MODELS.map((model) => (
                                <SelectItem key={model} value={model}>
                                  {model}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cor*</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={availableColors.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a cor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableColors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {availableColors.length === 0 && (
                              <FormDescription>
                                Selecione um modelo primeiro
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="storage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidade*</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={availableStorage.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a capacidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableStorage.map((storage) => (
                                  <SelectItem key={storage} value={storage}>
                                    {storage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {availableStorage.length === 0 && (
                              <FormDescription>
                                Selecione um modelo primeiro
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONDITION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="purchase_price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço de Compra*</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="0.00" 
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
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
                            <FormLabel>Preço de Venda*</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="0.00" 
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="supplier_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fornecedor*</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o fornecedor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="original_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Aquisição*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
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
                                disabled={(date) => date > new Date()}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="imei1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IMEI Principal*</FormLabel>
                            <FormControl>
                              <Input placeholder="15 dígitos" {...field} />
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
                            <FormLabel>IMEI Secundário</FormLabel>
                            <FormControl>
                              <Input placeholder="15 dígitos (opcional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="serial_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Série*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: C8QJ9Z7KPLFR" {...field} />
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
                            <Input placeholder="Ex: 95%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="has_apple_warranty"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Possui garantia Apple</FormLabel>
                              <FormDescription>
                                Marque se o dispositivo ainda está na garantia do fabricante.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch('has_apple_warranty') && (
                        <FormField
                          control={form.control}
                          name="warranty_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data de Expiração da Garantia</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
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
                                    selected={field.value || undefined}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detalhes adicionais, estado físico, acessórios incluídos, etc."
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevStep} className={isMobile ? "w-full" : ""}>
                Voltar
              </Button>
            )}
            <Button 
              onClick={handleNextStep}
              className={isMobile ? "w-full" : ""}
            >
              {currentStep < 2 ? (
                <>
                  Próximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : 'Salvar iPhone'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default DeviceAddPage;
