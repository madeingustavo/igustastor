
import React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useDevices } from '@/hooks/useDevices';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash, RefreshCw, Phone } from 'lucide-react';
import { Sale } from '@/types/schema';

interface SalesListProps {
  sales: Sale[];
  formatCurrency: (value: number) => string;
  onViewDetails: (sale: Sale) => void;
  onCancelSale: (id: string) => void;
  onDeleteSale: (id: string) => void;
}

const SalesList: React.FC<SalesListProps> = ({
  sales,
  formatCurrency,
  onViewDetails,
  onCancelSale,
  onDeleteSale
}) => {
  const { getCustomerById } = useCustomers();
  const { getDeviceById } = useDevices();
  
  return (
    <div className="space-y-3 mb-6">
      {sales.length === 0 ? (
        <div className="text-center py-8 bg-card border rounded-lg">
          <p className="text-muted-foreground">Nenhuma venda encontrada</p>
        </div>
      ) : (
        sales.map((sale) => {
          const device = getDeviceById(sale.device_id);
          const customer = getCustomerById(sale.customer_id);
          
          return (
            <Card key={sale.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <div className="font-medium">{device?.model || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatCurrency(sale.sale_price)}</div>
                    <div className="text-sm text-green-600">
                      +{formatCurrency(sale.profit)}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cliente:</span>
                    <span className="font-medium">{customer?.name || 'N/A'}</span>
                  </div>
                  
                  {customer?.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Contato:</span>
                      <a 
                        href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-green-600"
                      >
                        <Phone size={14} className="mr-1" />
                        {customer.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">IMEI:</span>
                    <span className="font-mono text-sm">{device?.imei1 || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="p-4 pt-0 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewDetails(sale)}
                  >
                    <Eye size={16} className="mr-2" />
                    Detalhes
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onCancelSale(sale.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Cancelar venda
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteSale(sale.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default SalesList;
