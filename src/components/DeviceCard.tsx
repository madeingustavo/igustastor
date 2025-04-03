
import React from 'react';
import { Eye, Edit, DollarSign } from 'lucide-react';
import { Device } from '../types/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '../hooks/useSettings';

interface DeviceCardProps {
  device: Device;
  onViewDetails: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onSellDevice: (device: Device) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ 
  device, 
  onViewDetails, 
  onEditDevice, 
  onSellDevice 
}) => {
  const { formatCurrency } = useSettings();
  
  // Format the battery health with visual indicator
  const formatBatteryHealth = () => {
    const batteryHealth = device.battery_health || '0%';
    const batteryValue = parseInt(batteryHealth.replace('%', '')) || 0;
    
    let bgColor = 'bg-red-100 text-red-800';
    let label = 'Ruim';
    
    if (batteryValue >= 80) {
      bgColor = 'bg-green-100 text-green-800';
      label = 'Boa';
    } else if (batteryValue >= 50) {
      bgColor = 'bg-yellow-100 text-yellow-800';
      label = 'Regular';
    }
    
    return (
      <div className="flex flex-col items-center mb-2">
        <div className="text-2xl font-bold mb-1">{batteryHealth}</div>
        <Badge variant="outline" className={`${bgColor} text-xs`}>
          {batteryValue} - {label}
        </Badge>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md overflow-hidden">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{device.model}</h3>
            <p className="text-sm text-muted-foreground">{device.storage}, {device.color}</p>
          </div>
          {device.status === 'available' && (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Disponível
            </Badge>
          )}
          {device.status === 'sold' && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Vendido
            </Badge>
          )}
          {device.status === 'reserved' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              Reservado
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border rounded-lg p-3 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Bateria</span>
            {formatBatteryHealth()}
          </div>
          <div className="border rounded-lg p-3 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Condição</span>
            <div className="text-lg font-semibold">{device.condition}</div>
            <Badge variant="outline" className="bg-green-100 text-green-800 mt-1">
              Excelente
            </Badge>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Preço de venda:</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(device.sale_price)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Fornecedor:</span>
            <span>{device.supplier_id}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Data:</span>
            <span>{new Date(device.created_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t flex justify-between gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails(device)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEditDevice(device)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        {device.status === 'available' && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onSellDevice(device)}
            className="bg-green-600 hover:bg-green-700"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Vender
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
