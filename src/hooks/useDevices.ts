
import { useState, useEffect, useCallback } from 'react';
import { Device, Supplier } from '../types/schema';
import { useSuppliers } from './useSuppliers';
import { useSettings } from './useSettings';
import { toast } from 'sonner';

// Custom hook to manage devices
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { suppliers } = useSuppliers();
  const { settings } = useSettings();

  // Load devices from localStorage when the component mounts
  useEffect(() => {
    loadDevices();
  }, []);

  // Load devices from localStorage
  const loadDevices = useCallback(() => {
    try {
      setIsLoading(true);
      const storedDevices = localStorage.getItem('devices');
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error('Failed to load devices from localStorage', error);
      toast.error('Falha ao carregar dispositivos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save devices to localStorage
  const saveDevices = useCallback((newDevices: Device[]) => {
    try {
      localStorage.setItem('devices', JSON.stringify(newDevices));
      setDevices(newDevices);
    } catch (error) {
      console.error('Failed to save devices to localStorage', error);
      toast.error('Falha ao salvar dispositivos');
    }
  }, []);

  // Generate a unique ID for new devices
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Generate a new device with default values
  const generateNewDevice = (deviceData: Omit<Device, 'id' | 'status' | 'created_date'>): Device => {
    const currentDate = new Date().toISOString();
    const newDevice: Device = {
      id: generateId(),
      ...deviceData,
      status: 'available',
      created_date: currentDate,
    };
    return newDevice;
  };

  // Add a new device
  const addDevice = useCallback((deviceData: Omit<Device, 'id' | 'status' | 'created_date'>) => {
    const newDevice = generateNewDevice(deviceData);
    saveDevices([...devices, newDevice]);
    toast.success(`Dispositivo ${deviceData.model} adicionado com sucesso`);
    return newDevice;
  }, [devices, saveDevices]);

  // Get a device by ID
  const getDeviceById = useCallback((id: string): Device | undefined => {
    return devices.find(device => device.id === id);
  }, [devices]);

  // Update a device by ID
  const updateDevice = useCallback((id: string, updates: Partial<Omit<Device, 'id' | 'created_date'>>) => {
    const device = getDeviceById(id);
    if (!device) {
      toast.error('Dispositivo não encontrado');
      return;
    }
    
    const updatedDevices = devices.map(device =>
      device.id === id ? { ...device, ...updates } : device
    );
    saveDevices(updatedDevices);
    toast.success(`Dispositivo ${device.model} atualizado com sucesso`);
  }, [devices, getDeviceById, saveDevices]);

  // Remove a device by ID
  const removeDevice = useCallback((id: string) => {
    const device = getDeviceById(id);
    if (!device) {
      toast.error('Dispositivo não encontrado');
      return;
    }
    
    const newDevices = devices.filter(device => device.id !== id);
    saveDevices(newDevices);
    toast.success(`Dispositivo ${device.model} removido com sucesso`);
  }, [devices, getDeviceById, saveDevices]);

  // Get the count of available devices
  const getAvailableDevicesCount = useCallback((): number => {
    return devices.filter(device => device.status === 'available').length;
  }, [devices]);

  // Get devices by supplier ID
  const getDevicesBySupplier = useCallback((supplierId: string): Device[] => {
    return devices.filter(device => device.supplier_id === supplierId);
  }, [devices]);

  // Get the total value of available inventory
  const getTotalInventoryValue = useCallback((): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + device.purchase_price, 0);
  }, [devices]);

  // Get the potential sales value of available devices
  const getPotentialSalesValue = useCallback((): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + device.sale_price, 0);
  }, [devices]);

  // Get the potential profit from available devices
  const getPotentialProfit = useCallback((): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + (device.sale_price - device.purchase_price), 0);
  }, [devices]);

  // Get devices that have been in inventory for longer than the threshold
  const getOldDevices = useCallback((daysThreshold = 30): Device[] => {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() - daysThreshold);
    
    return devices.filter(device => {
      if (device.status !== 'available') return false;
      const deviceDate = new Date(device.created_date);
      return deviceDate < threshold;
    });
  }, [devices]);

  // Get all devices with status filter
  const getAllDevices = useCallback((status?: 'available' | 'sold' | 'reserved'): Device[] => {
    if (!status) return devices;
    return devices.filter(device => device.status === status);
  }, [devices]);

  // Search devices by query
  const searchDevices = useCallback((query: string): Device[] => {
    if (!query || query.trim() === '') return devices;
    
    const lowercaseQuery = query.toLowerCase().trim();
    return devices.filter(device => 
      device.model.toLowerCase().includes(lowercaseQuery) ||
      device.serial_number.toLowerCase().includes(lowercaseQuery) ||
      device.color.toLowerCase().includes(lowercaseQuery) ||
      (device.notes && device.notes.toLowerCase().includes(lowercaseQuery))
    );
  }, [devices]);

  return {
    devices,
    isLoading,
    addDevice,
    getDeviceById,
    updateDevice,
    removeDevice,
    getAvailableDevicesCount,
    getDevicesBySupplier,
    getTotalInventoryValue,
    getPotentialSalesValue,
    getPotentialProfit,
    getOldDevices,
    getAllDevices,
    searchDevices,
  };
}
