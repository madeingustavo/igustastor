
import React, { useState } from 'react';
import { useDevices } from '../hooks/useDevices';
import { useSuppliers } from '../hooks/useSuppliers';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '../hooks/useSettings';
import Layout from '../components/Layout';

const Devices = () => {
  const { devices, getAvailableDevicesCount } = useDevices();
  const { suppliers, getSupplierById } = useSuppliers();
  const { formatCurrency } = useSettings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('model');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter and sort devices
  const filteredDevices = devices.filter(device => {
    // Apply status filter
    if (statusFilter !== 'all' && device.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        device.model.toLowerCase().includes(query) ||
        device.color.toLowerCase().includes(query) ||
        device.storage.toLowerCase().includes(query) ||
        device.serial_number.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort filtered devices
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
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Format device status
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
  
  // Get supplier name
  const getSupplierName = (supplierId: string) => {
    const supplier = getSupplierById(supplierId);
    return supplier ? supplier.name : 'N/A';
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
              Adicionar Dispositivo
            </Link>
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar dispositivos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleSort('model')}>
                    <span className="mr-2">Ordenar por Modelo</span>
                    {sortField === 'model' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('purchase_price')}>
                    <span className="mr-2">Ordenar por Preço de Compra</span>
                    {sortField === 'purchase_price' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('sale_price')}>
                    <span className="mr-2">Ordenar por Preço de Venda</span>
                    {sortField === 'sale_price' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('created_date')}>
                    <span className="mr-2">Ordenar por Data</span>
                    {sortField === 'created_date' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Especificações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Preço de Compra</TableHead>
                  <TableHead>Preço de Venda</TableHead>
                  <TableHead>Lucro Estimado</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDevices.length > 0 ? (
                  sortedDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.model}</TableCell>
                      <TableCell>
                        {device.storage}, {device.color}, {device.condition}
                      </TableCell>
                      <TableCell>{formatStatus(device.status)}</TableCell>
                      <TableCell>{getSupplierName(device.supplier_id)}</TableCell>
                      <TableCell>{formatCurrency(device.purchase_price)}</TableCell>
                      <TableCell>{formatCurrency(device.sale_price)}</TableCell>
                      <TableCell>
                        {formatCurrency(device.sale_price - device.purchase_price)}
                      </TableCell>
                      <TableCell>
                        {new Date(device.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/devices/${device.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhum dispositivo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Devices;
