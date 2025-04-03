
import React from 'react';
import { formatDate } from 'date-fns';
import { Sale } from '../types/schema';
import { useCustomers } from '../hooks/useCustomers';
import { useDevices } from '../hooks/useDevices';
import { useSettings } from '../hooks/useSettings';
import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SaleDetailsDialogProps {
  sale: Sale | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelSale: (id: string) => void;
  onDeleteSale: (id: string) => void;
}

export default function SaleDetailsDialog({
  sale,
  open,
  onOpenChange,
  onCancelSale,
  onDeleteSale
}: SaleDetailsDialogProps) {
  const { getCustomerById } = useCustomers();
  const { getDeviceById } = useDevices();
  const { formatCurrency } = useSettings();
  
  if (!sale) return null;
  
  const customer = getCustomerById(sale.customer_id);
  const device = getDeviceById(sale.device_id);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
          <DialogDescription>
            Venda realizada em {new Date(sale.sale_date).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Sale Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg text-gray-600 mb-4">Informações da Venda</h3>
            
            <div className="mb-4">
              <p className="text-gray-500">Comprador:</p>
              <p className="text-xl font-semibold">{customer?.name || 'N/A'}</p>
              {customer?.phone && (
                <a 
                  href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600"
                >
                  {customer.phone}
                </a>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500">Preço de Venda:</p>
              <p className="text-xl font-semibold">{formatCurrency(sale.sale_price)}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Lucro Líquido:</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(sale.profit)}
              </p>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <Button 
                variant="outline" 
                className="flex items-center text-orange-500 border-orange-500"
                onClick={() => onCancelSale(sale.id)}
              >
                <ReloadIcon className="mr-2 h-4 w-4" />
                Cancelar Venda
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center text-red-500 border-red-500"
                onClick={() => {
                  onDeleteSale(sale.id);
                  onOpenChange(false);
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Excluir Venda
              </Button>
            </div>
          </div>
          
          {/* Device Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg text-gray-600 mb-4">Detalhes do Dispositivo</h3>
            
            {!device ? (
              <p>Informações do dispositivo não disponíveis</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Modelo:</p>
                    <p className="font-medium">{device.model}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Cor:</p>
                    <p className="font-medium">{device.color}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Armazenamento:</p>
                    <p className="font-medium">{device.storage}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Condição:</p>
                    <p className="font-medium">{device.condition}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Bateria:</p>
                    <p className="font-medium">{device.battery_health || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Fornecedor:</p>
                    <p className="font-medium">{device.supplier_id}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-500">IMEI 1:</p>
                  <p className="font-medium">{device.imei1 || 'N/A'}</p>
                </div>
                
                <div className="mt-2">
                  <p className="text-gray-500">IMEI 2:</p>
                  <p className="font-medium">{device.imei2 || 'N/A'}</p>
                </div>
                
                <div className="mt-2">
                  <p className="text-gray-500">Número de Série:</p>
                  <p className="font-medium">{device.serial_number || 'N/A'}</p>
                </div>
                
                <div className="mt-2">
                  <p className="text-gray-500">Data de Cadastro:</p>
                  <p className="font-medium">
                    {new Date(device.created_date).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
