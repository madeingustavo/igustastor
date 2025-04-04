
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDevices } from './useDevices';
import { MODEL_SPECS } from '../utils/deviceConstants';
import { formSchema, FormValues, Step } from '../components/deviceForm/types';
import { format } from 'date-fns';

interface UseDeviceFormProps {
  deviceId?: string;
}

export const useDeviceForm = ({ deviceId }: UseDeviceFormProps = {}) => {
  const navigate = useNavigate();
  const { addDevice, getDeviceById, updateDevice } = useDevices();
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

  // Watch for selected model to update available options
  const selectedModel = form.watch('model');

  // Update available colors and storage when model changes
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
    if (deviceId) {
      const device = getDeviceById(deviceId);
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
  }, [deviceId, getDeviceById, navigate, form]);

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
      
      if (isEditing && deviceId) {
        // Update existing device
        updateDevice(deviceId, formattedData);
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

  return {
    form,
    currentStep,
    setCurrentStep,
    isEditing,
    availableColors,
    availableStorage,
    nextStep,
    prevStep,
    onSubmit,
  };
};
