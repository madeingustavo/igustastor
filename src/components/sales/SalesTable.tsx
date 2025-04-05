
import React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useDevices } from '@/hooks/useDevices';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Trash, RefreshCw } from 'lucide-react';
import { Sale } from '@/types/schema';

interface SalesTableProps {
  sales: Sale[];
  formatCurrency: (value: number) => string;
  onViewDetails: (sale: Sale) => void;
  onCancelSale: (id: string) => void;
  onDeleteSale: (id: string) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  formatCurrency,
  onViewDetails,
  onCancelSale,
  onDeleteSale
}) => {
  const { getCustomerById } = useCustomers();
  const { getDeviceById } = useDevices();
  
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>IMEI</TableHead>
            <TableHead>Comprador</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Lucro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Nenhuma venda encontrada
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => {
              const device = getDeviceById(sale.device_id);
              const customer = getCustomerById(sale.customer_id);
              
              return (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                  <TableCell>{device?.model || 'N/A'}</TableCell>
                  <TableCell>{device?.imei1 || 'N/A'}</TableCell>
                  <TableCell>{customer?.name || 'N/A'}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{formatCurrency(sale.sale_price)}</TableCell>
                  <TableCell className="text-green-600">
                    {formatCurrency(sale.profit)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(sale)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
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
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesTable;
