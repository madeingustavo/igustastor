
import React from 'react';
import { Device } from '../../types/schema';
import DeviceCard from '../DeviceCard';

interface DeviceCardsProps {
  devices: Device[];
  onViewDetails: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onSellDevice: (device: Device) => void;
}

const DeviceCards: React.FC<DeviceCardsProps> = ({
  devices,
  onViewDetails,
  onEditDevice,
  onSellDevice
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.length > 0 ? (
          devices.map((device) => (
            <DeviceCard 
              key={device.id}
              device={device}
              onViewDetails={onViewDetails}
              onEditDevice={onEditDevice}
              onSellDevice={onSellDevice}
            />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            Nenhum dispositivo encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCards;
