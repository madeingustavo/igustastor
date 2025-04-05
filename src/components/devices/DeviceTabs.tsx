
import React from 'react';
import { Device } from '../../types/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceTable from './DeviceTable';
import DeviceCards from './DeviceCards';

interface DeviceTabsProps {
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
  sortedDevices: Device[];
  handleViewDetails: (device: Device) => void;
  handleEditDevice: (device: Device) => void;
  handleSellDevice: (device: Device) => void;
}

const DeviceTabs: React.FC<DeviceTabsProps> = ({
  viewMode,
  setViewMode,
  sortedDevices,
  handleViewDetails,
  handleEditDevice,
  handleSellDevice
}) => {
  return (
    <Tabs 
      defaultValue={viewMode} 
      value={viewMode} 
      onValueChange={(val) => setViewMode(val as 'table' | 'cards')}
    >
      <TabsList className="hidden">
        <TabsTrigger value="table">Tabela</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
      </TabsList>
      
      <TabsContent value="table" className="mt-0">
        <DeviceTable 
          devices={sortedDevices}
          onViewDetails={handleViewDetails}
          onEditDevice={handleEditDevice}
          onSellDevice={handleSellDevice}
        />
      </TabsContent>
      
      <TabsContent value="cards" className="mt-0">
        <DeviceCards 
          devices={sortedDevices}
          onViewDetails={handleViewDetails}
          onEditDevice={handleEditDevice}
          onSellDevice={handleSellDevice}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DeviceTabs;
