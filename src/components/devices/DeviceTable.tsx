
import React from 'react';
import { Device } from '../../types/schema';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useSettings } from '../../hooks/useSettings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DeviceTableProps {
  devices: Device[];
  onViewDetails: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onSellDevice: (device: Device) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({ 
  devices,
  onViewDetails,
  onEditDevice,
  onSellDevice
}) => {
  const { getSupplierById } = useSuppliers();
  const { formatCurrency } = useSettings();

  const formatStatus = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Disponível</Badge>;
      case 'sold':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Vendido</Badge>;
      case 'reserved':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Reservado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getSupplierName = (supplierId: string) => {
    const supplier = getSupplierById(supplierId);
    return supplier ? supplier.name : 'N/A';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead>Especificações</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bateria</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Preço de Venda</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.model}</TableCell>
                <TableCell>
                  {device.storage}, {device.color}, {device.condition}
                </TableCell>
                <TableCell>{formatStatus(device.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    (device.battery_health && parseInt(device.battery_health) >= 80)
                      ? "bg-green-100 text-green-800"
                      : (device.battery_health && parseInt(device.battery_health) >= 50)
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }>
                    {device.battery_health || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>{getSupplierName(device.supplier_id)}</TableCell>
                <TableCell>{formatCurrency(device.sale_price)}</TableCell>
                <TableCell>
                  {new Date(device.created_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(device)}>
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditDevice(device)}>
                      Editar
                    </Button>
                    {device.status === 'available' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => onSellDevice(device)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Vender
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum dispositivo encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeviceTable;
