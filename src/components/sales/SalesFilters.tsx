
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Search, X, Calendar } from 'lucide-react';
import { DatePickerWithRange } from '@/components/reports/DatePickerWithRange';
import { DateRange } from 'react-day-picker';

interface SalesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  dateRange?: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  isMobile: boolean;
}

const SalesFilters: React.FC<SalesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  timeFilter,
  setTimeFilter,
  dateRange,
  setDateRange,
  isMobile
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Search Bar */}
      <div className="w-full relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Buscar por nome, modelo, IMEI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Filters */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={timeFilter === 'current-month' ? 'default' : 'outline'} 
            onClick={() => {
              setTimeFilter('current-month');
              setDateRange({});
            }}
            size={isMobile ? "sm" : "default"}
          >
            Mês Atual
          </Button>
          <Button 
            variant={timeFilter === 'last-7-days' ? 'default' : 'outline'} 
            onClick={() => {
              setTimeFilter('last-7-days');
              setDateRange({});
            }}
            size={isMobile ? "sm" : "default"}
          >
            7 dias
          </Button>
          <Button 
            variant={timeFilter === 'last-30-days' ? 'default' : 'outline'} 
            onClick={() => {
              setTimeFilter('last-30-days');
              setDateRange({});
            }}
            size={isMobile ? "sm" : "default"}
          >
            30 dias
          </Button>
          <Button 
            variant={timeFilter === 'all-time' ? 'default' : 'outline'} 
            onClick={() => {
              setTimeFilter('all-time');
              setDateRange({});
            }}
            size={isMobile ? "sm" : "default"}
          >
            Todo o período
          </Button>
          
          {/* Custom Date Range */}
          <DatePickerWithRange 
            dateRange={dateRange as DateRange}
            onRangeChange={(range) => {
              setDateRange(range || {});
              if (range) {
                setTimeFilter('custom-range');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesFilters;
