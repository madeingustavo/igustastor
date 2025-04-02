
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { Device } from '../types/schema';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>(AppStorageManager.getDevices());

  // Sync with localStorage whenever devices change
  useEffect(() => {
    AppStorageManager.saveDevices(devices);
  }, [devices]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new device
  const addDevice = (deviceData: Omit<Device, 'id' | 'created_date' | 'status'>) => {
    const now = new Date().toISOString();
    
    const newDevice: Device = {
      ...deviceData,
      id: generateId(),
      created_date: now,
      status: 'available',
      original_date: deviceData.original_date || now,
      _exact_original_date: deviceData._exact_original_date || now
    };

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

  // Mark a device as sold
  const markAsSold = (deviceId: string, saleData: { customer_id: string, sale_price: number, payment_method: string }) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return null;
    
    // Update device status
    updateDevice(deviceId, { status: 'sold' });
    
    // Calculate profit
    const profit = saleData.sale_price - device.purchase_price;
    
    // Create sale record (handled in useSales hook, but returned here for convenience)
    const saleRecord = {
      id: generateId(),
      device_id: deviceId,
      customer_id: saleData.customer_id,
      sale_price: saleData.sale_price,
      profit,
      sale_date: new Date().toISOString(),
      created_date: new Date().toISOString(),
      payment_method: saleData.payment_method as any,
      status: 'completed' as const
    };
    
    return saleRecord;
  };

  // Get available devices
  const getAvailableDevices = () => {
    return devices.filter(device => device.status === 'available');
  };

  // Get sold devices
  const getSoldDevices = () => {
    return devices.filter(device => device.status === 'sold');
  };

  // Get device by ID
  const getDeviceById = (id: string) => {
    return devices.find(device => device.id === id);
  };

  // Get total inventory value
  const getTotalInventoryValue = () => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((total, device) => total + device.purchase_price, 0);
  };

  // Get potential sales value
  const getPotentialSalesValue = () => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((total, device) => total + device.sale_price, 0);
  };

  // Get potential profit
  const getPotentialProfit = () => {
    return devices
      .filter(device => device.status === 'available')
      .reduce((total, device) => total + (device.sale_price - device.purchase_price), 0);
  };

  // Get available devices count
  const getAvailableDevicesCount = () => {
    return devices.filter(device => device.status === 'available').length;
  };

  // Get oldest devices (in stock for more than 30 days)
  const getOldDevices = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return devices
      .filter(device => 
        device.status === 'available' && 
        new Date(device.created_date) < thirtyDaysAgo
      )
      .sort((a, b) => 
        new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
      );
  };

  return {
    devices,
    addDevice,
    updateDevice,
    removeDevice,
    markAsSold,
    getAvailableDevices,
    getSoldDevices,
    getDeviceById,
    getTotalInventoryValue,
    getPotentialSalesValue,
    getPotentialProfit,
    getAvailableDevicesCount,
    getOldDevices
  };
};
