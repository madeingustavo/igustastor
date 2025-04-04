
import { useState, useEffect, useCallback } from 'react';
import { Device, Supplier } from '../types/schema';
import { useSuppliers } from './useSuppliers';
import { useSettings } from './useSettings';

// Custom hook to manage devices
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const { suppliers } = useSuppliers();
  const { settings } = useSettings();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = useCallback(() => {
    try {
      const storedDevices = localStorage.getItem('devices');
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error('Failed to load devices from localStorage', error);
    }
  }, []);

  const saveDevices = (newDevices: Device[]) => {
    try {
      localStorage.setItem('devices', JSON.stringify(newDevices));
      setDevices(newDevices);
    } catch (error) {
      console.error('Failed to save devices to localStorage', error);
    }
  };

  const addDevice = (deviceData: Omit<Device, 'id' | 'status' | 'created_date'>) => {
    const newDevice = generateNewDevice(deviceData);
    saveDevices([...devices, newDevice]);
    return newDevice;
  };

  const getDeviceById = (id: string): Device | undefined => {
    return devices.find(device => device.id === id);
  };

  const updateDevice = (id: string, updates: Partial<Omit<Device, 'id' | 'created_date'>>) => {
    const updatedDevices = devices.map(device =>
      device.id === id ? { ...device, ...updates } : device
    );
    saveDevices(updatedDevices);
  };

  const removeDevice = (id: string) => {
    const newDevices = devices.filter(device => device.id !== id);
    saveDevices(newDevices);
  };

  const getAvailableDevicesCount = (): number => {
    return devices.filter(device => device.status === 'available').length;
  };

  const getDevicesBySupplier = (supplierId: string): Device[] => {
    return devices.filter(device => device.supplier_id === supplierId);
  };

  // Add new functions needed by Dashboard
  const getTotalInventoryValue = (): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + device.purchase_price, 0);
  };

  const getPotentialSalesValue = (): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + device.sale_price, 0);
  };

  const getPotentialProfit = (): number => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((sum, device) => sum + (device.sale_price - device.purchase_price), 0);
  };

  const getOldDevices = (daysThreshold = 30): Device[] => {
    const now = new Date();
    const threshold = new Date(now);
    threshold.setDate(now.getDate() - daysThreshold);
    
    return devices.filter(device => {
      if (device.status !== 'available') return false;
      const deviceDate = new Date(device.created_date);
      return deviceDate < threshold;
    });
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateNewDevice = (deviceData: Omit<Device, 'id' | 'status' | 'created_date'>) => {
    const currentDate = new Date().toISOString();
    const newDevice: Device = {
      id: generateId(),
      ...deviceData,
      status: 'available',
      created_date: currentDate,
    };
    return newDevice;
  };

  return {
    devices,
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
  };
}
