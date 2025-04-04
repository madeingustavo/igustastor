
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import { CalendarIcon, ArrowLeft, QrCode } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Layout from '../components/Layout';
import { IPHONE_MODELS, MODEL_SPECS, CONDITION_OPTIONS } from '../utils/deviceConstants';
import { useDevices } from '../hooks/useDevices';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSettings } from '../hooks/useSettings';
import { toast } from 'sonner';
import { Device } from '../types/schema';
import { formatCondition } from '../utils/formatters';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

type Step = 'model' | 'color' | 'storage' | 'details';

const DeviceAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDevice, getDeviceById, updateDevice } = useDevices();
  const { suppliers } = useSuppliers();
  const { formatCurrency } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [calculatedProfit, setCalculatedProfit] = useState(0);
  const [currentStep, setCurrentStep] = useState<Step>('model');
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableStorage, setAvailableStorage] = useState<string[]>([]);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: '',
      storage: '',
      color: '',
      condition: '10',
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
  const selectedModel = form.watch('model');
  const selectedColor = form.watch('color');

  // Update available colors when model changes
  useEffect(() => {
    if (selectedModel) {
      const modelSpec = MODEL_SPECS[selectedModel as keyof typeof MODEL_SPECS];
      if (modelSpec) {
        setAvailableColors(modelSpec.colors);
        setAvailableStorage(modelSpec.storage);
      }
    }
  }, [selectedModel]);

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

        // Update available options based on loaded device
        if (device.model) {
          const modelSpec = MODEL_SPECS[device.model as keyof typeof MODEL_SPECS];
          if (modelSpec) {
            setAvailableColors(modelSpec.colors);
            setAvailableStorage(modelSpec.storage);
          }
        }
      } else {
        // If device not found, redirect back to devices list
        navigate('/devices');
        toast.error("Dispositivo não encontrado");
      }
    }
  }, [id, getDeviceById, navigate, form]);

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    try {
      console.log("Form data submitted:", data);
      
      // Format dates for storage and ensure all required fields are included
      const formattedData = {
        model: data.model,
        storage: data.storage,
        color: data.color,
        condition: data.condition,
        purchase_price: data.purchase_price,
        sale_price: data.sale_price,
        supplier_id: data.supplier_id,
        serial_number: data.serial_number || '',
        notes: data.notes || '',
        warranty_date: data.warranty_date ? data.warranty_date.toISOString() : undefined,
        purchase_date: data.purchase_date ? data.purchase_date.toISOString() : undefined,
        original_date: data.original_date ? data.original_date.toISOString() : undefined,
        _exact_original_date: data.original_date ? format(data.original_date, 'dd/MM/yyyy') : undefined,
        imei1: data.imei1,
        imei2: data.imei2,
        battery_health: data.battery_health,
        has_apple_warranty: data.has_apple_warranty,
      };
      
      if (isEditing && id) {
        // Update existing device
        updateDevice(id, formattedData);
        toast.success(`Dispositivo ${data.model} atualizado com sucesso`);
      } else {
        // Add new device
        const newDevice = addDevice(formattedData);
        toast.success(`Dispositivo ${data.model} adicionado com sucesso`);
      }
      
      // Redirect to devices list
      navigate('/devices');
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error("Ocorreu um erro ao tentar salvar o dispositivo. Tente novamente.");
    }
  };

  const nextStep = () => {
    if (currentStep === 'model') {
      // Validate model before proceeding
      const isModelValid = form.trigger('model');
      if (isModelValid) {
        setCurrentStep('color');
      }
    } else if (currentStep === 'color') {
      // Validate color before proceeding
      const isColorValid = form.trigger('color');
      if (isColorValid) {
        setCurrentStep('storage');
      }
    } else if (currentStep === 'storage') {
      // Validate storage before proceeding
      const isStorageValid = form.trigger('storage');
      if (isStorageValid) {
        setCurrentStep('details');
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 'color') {
      setCurrentStep('model');
    } else if (currentStep === 'storage') {
      setCurrentStep('color');
    } else if (currentStep === 'details') {
      setCurrentStep('storage');
    }
  };

  // Render step indicator
  const StepIndicator = () => {
    return (
      <div className="flex items-center mb-8">
        <div 
          className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
            currentStep === 'model' || currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
              ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'
          }`}
        >
          1
        </div>
        <div className={`h-1 w-16 ${
          currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
            ? 'bg-blue-500' : 'bg-gray-200'
        }`}></div>
        <div 
          className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
            currentStep === 'color' || currentStep === 'storage' || currentStep === 'details' 
              ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          2
        </div>
        <div className={`h-1 w-16 ${
          currentStep === 'storage' || currentStep === 'details' 
            ? 'bg-blue-500' : 'bg-gray-200'
        }`}></div>
        <div 
          className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
            currentStep === 'storage' || currentStep === 'details' 
              ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          3
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'model':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Selecione o modelo</h2>
            </div>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Modelo do iPhone *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset color and storage when model changes
                      form.setValue('color', '');
                      form.setValue('storage', '');
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      {IPHONE_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-8">
              <Button onClick={nextStep} disabled={!form.watch('model')}>
                Próximo
              </Button>
            </div>
          </div>
        );
      case 'color':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Escolha a cor</h2>
            </div>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Cor *</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableColors.map((color) => (
                      <div 
                        key={color}
                        className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                          field.value === color ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => field.onChange(color)}
                      >
                        <div className="flex items-center">
                          <div className={`h-6 w-6 rounded-full mr-2 border ${
                            field.value === color ? 'border-blue-500' : 'border-gray-300'
                          }`}>
                            {field.value === color && (
                              <div className="h-full w-full rounded-full bg-blue-500 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              </div>
                            )}
                          </div>
                          <span>{color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para seleção de modelo
              </Button>
              <Button onClick={nextStep} disabled={!form.watch('color')}>
                Próximo
              </Button>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Defina o armazenamento</h2>
            </div>
            <FormField
              control={form.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Armazenamento *</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {availableStorage.map((storage) => (
                      <FormItem key={storage}>
                        <FormLabel className="border rounded-md p-4 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center h-16 w-full text-center">
                          <FormControl>
                            <RadioGroupItem value={storage} className="sr-only" />
                          </FormControl>
                          <span className={field.value === storage ? "font-bold text-blue-500" : ""}>
                            {storage}
                          </span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para seleção de cor
              </Button>
              <Button onClick={nextStep} disabled={!form.watch('storage')}>
                Próximo
              </Button>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-2">Especificações selecionadas</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="font-medium">{form.watch('model')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cor</p>
                  <div className="flex items-center">
                    <span className="inline-block h-4 w-4 rounded-full bg-yellow-400 mr-2"></span>
                    <p className="font-medium">{form.watch('color')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Armazenamento</p>
                  <p className="font-medium">{form.watch('storage')}</p>
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

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para seleção de armazenamento
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Adicionar Dispositivo
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4 p-2" 
            onClick={() => navigate('/devices')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Novo iPhone</h1>
        </div>
        
        <Form {...form}>
          <form className="space-y-8">
            <StepIndicator />
            {renderStepContent()}
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default DeviceAddPage;
