
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { MODEL_SPECS } from '../utils/deviceConstants';
import { useDevices } from '../hooks/useDevices';
import { useSuppliers } from '../hooks/useSuppliers';
import { toast } from 'sonner';
import { formSchema, FormValues, Step } from '../components/deviceForm/types';
import StepIndicator from '../components/deviceForm/StepIndicator';
import ModelSelectionStep from '../components/deviceForm/ModelSelectionStep';
import ColorSelectionStep from '../components/deviceForm/ColorSelectionStep';
import StorageSelectionStep from '../components/deviceForm/StorageSelectionStep';
import DeviceDetailsStep from '../components/deviceForm/DeviceDetailsStep';

const DeviceAddPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDevice, getDeviceById, updateDevice } = useDevices();
  const { suppliers } = useSuppliers();
  const [isEditing, setIsEditing] = useState(false);
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

  // Watch for selected model and color to update available options
  const selectedModel = form.watch('model');

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

  // Navigation handlers
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

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'model':
        return <ModelSelectionStep onNext={nextStep} />;
      case 'color':
        return <ColorSelectionStep onNext={nextStep} onPrevious={prevStep} availableColors={availableColors} />;
      case 'storage':
        return <StorageSelectionStep onNext={nextStep} onPrevious={prevStep} availableStorage={availableStorage} />;
      case 'details':
        return (
          <DeviceDetailsStep 
            onPrevious={prevStep} 
            onSubmit={form.handleSubmit(onSubmit)} 
            setCurrentStep={setCurrentStep}
            suppliers={suppliers}
          />
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
        
        <FormProvider {...form}>
          <Form {...form}>
            <form className="space-y-8">
              <StepIndicator currentStep={currentStep} />
              {renderStepContent()}
            </form>
          </Form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default DeviceAddPage;
