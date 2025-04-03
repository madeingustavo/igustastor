
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Device } from '../types/schema';
import { toast } from 'sonner';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>(AppStorageManager.getDevices());
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  // Sync with localStorage whenever devices change
  useEffect(() => {
    AppStorageManager.saveDevices(devices);
  }, [devices]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new device
  const addDevice = (deviceData: Omit<Device, 'id' | 'status' | 'created_date'>) => {
    const newDevice: Device = {
      ...deviceData,
      id: generateId(),
      status: 'available',
      created_date: new Date().toISOString()
    };

    // Handle Date objects by converting them to strings
    if (deviceData.warranty_date) {
      newDevice.warranty_date = typeof deviceData.warranty_date === 'object' 
        ? deviceData.warranty_date.toISOString() 
        : deviceData.warranty_date;
    }
    
    if (deviceData.original_date) {
      newDevice.original_date = typeof deviceData.original_date === 'object' 
        ? deviceData.original_date.toISOString() 
        : deviceData.original_date;
      newDevice._exact_original_date = deviceData.original_date.toString();
    }

    setDevices(prev => [...prev, newDevice]);
    toast.success(`Dispositivo ${newDevice.model} adicionado com sucesso!`);
    return newDevice;
  };

  // Update an existing device
  const updateDevice = (id: string, deviceData: Partial<Device>) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, ...deviceData } 
          : device
      )
    );
    toast.success('Dispositivo atualizado com sucesso!');
  };

  // Remove a device
  const removeDevice = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    setDevices(prev => prev.filter(device => device.id !== id));
    toast.info(`Dispositivo ${device.model} removido.`);
  };

  // Remove multiple devices
  const removeMultipleDevices = (ids: string[]) => {
    if (ids.length === 0) return;
    
    setDevices(prev => prev.filter(device => !ids.includes(device.id)));
    toast.info(`${ids.length} dispositivo(s) removidos.`);
    setSelectedDevices([]);
  };

  // Toggle device selection
  const toggleDeviceSelection = (id: string) => {
    setSelectedDevices(prev => 
      prev.includes(id) ? prev.filter(deviceId => deviceId !== id) : [...prev, id]
    );
  };

  // Select all devices
  const selectAllDevices = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(device => device.id));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedDevices([]);
  };

  // Mark a device as sold
  const markAsSold = (id: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, status: 'sold' } 
          : device
      )
    );
  };

  // Get device by ID
  const getDeviceById = (id: string) => {
    return devices.find(device => device.id === id);
  };

  // Get devices by supplier ID
  const getDevicesBySupplier = (supplierId: string) => {
    return devices.filter(device => device.supplier_id === supplierId);
  };

  // Filter devices
  const filterDevices = (
    filters: {
      status?: 'available' | 'sold' | 'reserved';
      model?: string;
      priceMin?: number;
      priceMax?: number;
      condition?: string;
    }
  ) => {
    return devices.filter(device => {
      if (filters.status && device.status !== filters.status) {
        return false;
      }
      
      if (filters.model && !device.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }
      
      if (filters.priceMin && device.sale_price < filters.priceMin) {
        return false;
      }
      
      if (filters.priceMax && device.sale_price > filters.priceMax) {
        return false;
      }
      
      if (filters.condition && device.condition !== filters.condition) {
        return false;
      }
      
      return true;
    });
  };

  // Get available devices
  const getAvailableDevices = () => {
    return devices.filter(device => device.status === 'available');
  };

  // Get sold devices
  const getSoldDevices = () => {
    return devices.filter(device => device.status === 'sold');
  };
  
  // Get total inventory value (sum of purchase prices for available devices)
  const getTotalInventoryValue = () => {
    return getAvailableDevices().reduce((total, device) => total + device.purchase_price, 0);
  };
  
  // Get potential sales value (sum of sale prices for available devices)
  const getPotentialSalesValue = () => {
    return getAvailableDevices().reduce((total, device) => total + device.sale_price, 0);
  };
  
  // Get potential profit (difference between potential sales and inventory value)
  const getPotentialProfit = () => {
    return getPotentialSalesValue() - getTotalInventoryValue();
  };
  
  // Get the count of available devices
  const getAvailableDevicesCount = () => {
    return getAvailableDevices().length;
  };
  
  // Get devices that are more than 30 days old
  const getOldDevices = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return getAvailableDevices().filter(device => {
      const deviceDate = new Date(device.created_date);
      return deviceDate < thirtyDaysAgo;
    });
  };

  return {
    devices,
    selectedDevices,
    addDevice,
    updateDevice,
    removeDevice,
    removeMultipleDevices,
    toggleDeviceSelection,
    selectAllDevices,
    clearSelection,
    markAsSold,
    getDeviceById,
    getDevicesBySupplier,
    filterDevices,
    getAvailableDevices,
    getSoldDevices,
    getTotalInventoryValue,
    getPotentialSalesValue,
    getPotentialProfit,
    getAvailableDevicesCount,
    getOldDevices
  };
};
