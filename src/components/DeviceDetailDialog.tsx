
import React from 'react';
import { Device } from '../types/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '../hooks/useSettings';
import { useSuppliers } from '../hooks/useSuppliers';
import { X } from 'lucide-react';

interface DeviceDetailDialogProps {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeviceDetailDialog: React.FC<DeviceDetailDialogProps> = ({ 
  device, 
  open, 
  onOpenChange 
}) => {
  const { formatCurrency } = useSettings();
  const { getSupplierById } = useSuppliers();
  
  if (!device) return null;
  
  const supplier = getSupplierById(device.supplier_id);
  const supplierName = supplier ? supplier.name : 'N/A';
  
  // Format the battery health
  const batteryHealth = device.battery_health || 'N/A';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {device.model} {device.storage}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 mt-4">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-lg">Detalhes do Dispositivo</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Modelo</span>
                <span className="font-medium">{device.model}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Armazenamento</span>
                <span className="font-medium">{device.storage}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">IMEI 1</span>
                <span className="font-medium">{device.imei1 || 'N/A'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">IMEI 2</span>
                <span className="font-medium">{device.imei2 || 'N/A'}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Número de Série</span>
                <span className="font-medium">{device.serial_number}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Data de Cadastro</span>
                <span className="font-medium">{new Date(device.created_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">Bateria</span>
              <div className="text-3xl font-bold mb-1">{batteryHealth}</div>
              <Badge 
                variant="outline" 
                className={
                  parseInt(batteryHealth) >= 80 
                    ? "bg-green-100 text-green-800" 
                    : parseInt(batteryHealth) >= 50 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-red-100 text-red-800"
                }
              >
                {parseInt(batteryHealth) >= 80 
                  ? `${batteryHealth} - Boa` 
                  : parseInt(batteryHealth) >= 50 
                  ? `${batteryHealth} - Regular` 
                  : `${batteryHealth} - Ruim`}
              </Badge>
            </div>
            
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-2">Condição</span>
              <div className="text-3xl font-bold mb-1">10/10</div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Excelente
              </Badge>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-lg">Informações Financeiras</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Preço de Compra</span>
                <span className="font-medium">{formatCurrency(device.purchase_price)}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Fornecedor</span>
                <span className="font-medium">{supplierName}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Garantia Apple</span>
                <span className="font-medium">
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {device.has_apple_warranty ? 'Até ' + (device.warranty_date ? new Date(device.warranty_date).toLocaleDateString() : 'N/A') : 'Não possui'}
                  </Badge>
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Observações</h3>
            <p className="text-muted-foreground">
              {device.notes || 'Sem observações.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceDetailDialog;
