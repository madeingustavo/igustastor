
import React, { useState, useEffect } from 'react';
import { useDevices } from '../hooks/useDevices';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Device } from '../types/schema';
import Layout from '../components/Layout';
import DeviceDetailDialog from '../components/DeviceDetailDialog';
import SellDeviceDialog from '../components/SellDeviceDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import DeviceFilters from '../components/devices/DeviceFilters';
import DeviceTable from '../components/devices/DeviceTable';
import DeviceCards from '../components/devices/DeviceCards';
import DeviceTabs from '../components/devices/DeviceTabs';

const Devices = () => {
  const { devices, getAvailableDevicesCount } = useDevices();
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('available');
  const [sortField, setSortField] = useState<string>('model');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(isMobile ? 'cards' : 'table');
  
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  
  useEffect(() => {
    setViewMode(isMobile ? 'cards' : viewMode);
  }, [isMobile, viewMode]);
  
  const filteredDevices = devices.filter(device => {
    if (statusFilter !== 'all' && device.status !== statusFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        device.model.toLowerCase().includes(query) ||
        device.color.toLowerCase().includes(query) ||
        device.storage.toLowerCase().includes(query) ||
        device.serial_number.toLowerCase().includes(query) ||
        (device.imei1 && device.imei1.toLowerCase().includes(query)) ||
        (device.imei2 && device.imei2.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'model') {
      comparison = a.model.localeCompare(b.model);
    } else if (sortField === 'purchase_price') {
      comparison = a.purchase_price - b.purchase_price;
    } else if (sortField === 'sale_price') {
      comparison = a.sale_price - b.sale_price;
    } else if (sortField === 'created_date') {
      comparison = new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const clearFilters = () => {
    setStatusFilter('available');
    setSearchQuery('');
    setSortField('model');
    setSortDirection('asc');
  };
  
  const handleViewDetails = (device: Device) => {
    setSelectedDevice(device);
    setDetailsDialogOpen(true);
  };
  
  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    console.log("Edit device", device.id);
  };
  
  const handleSellDevice = (device: Device) => {
    setSelectedDevice(device);
    setSellDialogOpen(true);
  };

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dispositivos</h1>
            <p className="text-muted-foreground mt-1">
              {getAvailableDevicesCount()} dispositivos disponíveis, {devices.length} no total
            </p>
          </div>
          <Button asChild>
            <Link to="/devices/add">
              <Plus className="h-4 w-4 mr-2" />
              Novo iPhone
            </Link>
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden">
          <DeviceFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            toggleSort={toggleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            clearFilters={clearFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <DeviceTabs 
            viewMode={viewMode} 
            setViewMode={setViewMode}
            sortedDevices={sortedDevices}
            handleViewDetails={handleViewDetails}
            handleEditDevice={handleEditDevice}
            handleSellDevice={handleSellDevice}
          />
          
          <div className="p-4 border-t text-sm text-muted-foreground">
            {filteredDevices.length} dispositivos encontrados
          </div>
        </div>
      </div>
      
      <DeviceDetailDialog 
        device={selectedDevice} 
        open={detailsDialogOpen} 
        onOpenChange={setDetailsDialogOpen} 
      />
      
      <SellDeviceDialog 
        device={selectedDevice} 
        open={sellDialogOpen} 
        onOpenChange={setSellDialogOpen} 
      />
    </Layout>
  );
};

export default Devices;
