
import React from 'react';
import { Search, Filter, SortAsc, SortDesc, List, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeviceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  toggleSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  clearFilters: () => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
}

const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  toggleSort,
  sortField,
  sortDirection,
  clearFilters,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="p-4 border-b flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por modelo, cor, IMEI..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
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
        
        <Button variant="outline" onClick={clearFilters}>
          Limpar filtros
        </Button>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('table')}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('cards')}
            className="rounded-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceFilters;
