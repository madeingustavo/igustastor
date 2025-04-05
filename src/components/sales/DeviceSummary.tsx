
import React from 'react';
import { Device } from '@/types/schema';

interface DeviceSummaryProps {
  device: Device;
  formatCurrency: (value: number) => string;
}

const DeviceSummary: React.FC<DeviceSummaryProps> = ({ device, formatCurrency }) => {
  return (
    <div className="py-2">
      <h3 className="font-medium text-lg">{device.model} {device.storage}</h3>
      <p className="text-sm text-muted-foreground">IMEI: {device.imei1 || 'N/A'}</p>
      <p className="text-sm text-muted-foreground">Preço de compra: {formatCurrency(device.purchase_price)}</p>
    </div>
  );
};

export default DeviceSummary;
