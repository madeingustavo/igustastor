
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useExpenses } from '../hooks/useExpenses';
import { useDevices } from '../hooks/useDevices';
import { useSettings } from '../hooks/useSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Expense, Device } from '../types/schema';
import { 
  Plus, MoreHorizontal, Trash, X, Check, Search, Filter, 
  Calendar as CalendarIcon, Tag, Download, FileText
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Expenses = () => {
  const { 
    expenses, 
    addExpense, 
    removeExpense, 
    getAllCategories, 
    getExpensesByDeviceId 
  } = useExpenses();
  const { devices, getDeviceById } = useDevices();
  const { formatCurrency } = useSettings();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
  // New expense form state
  const [newExpense, setNewExpense] = useState({
    device_id: '',
    description: '',
    amount: 0,
    date: new Date().toISOString(),
    category: 'Reparo'
  });
  
  // Handle date selection
  const [date, setDate] = useState<Date>(new Date());
  
  // Filter expenses based on search and device filter
  const filteredExpenses = expenses.filter(expense => {
    // Filter by search term
    if (searchTerm) {
      const device = getDeviceById(expense.device_id);
      const descriptionMatches = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      const deviceMatches = device && device.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!descriptionMatches && !deviceMatches) {
        return false;
      }
    }
    
    // Filter by device
    if (deviceFilter !== 'all' && expense.device_id !== deviceFilter) {
      return false;
    }
    
    return true;
  });
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Toggle expense selection
  const toggleExpenseSelection = (id: string) => {
    setSelectedExpenses(prev => 
      prev.includes(id) 
        ? prev.filter(expenseId => expenseId !== id) 
        : [...prev, id]
    );
  };
  
  // Select all expenses
  const selectAllExpenses = () => {
    if (selectedExpenses.length === filteredExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(filteredExpenses.map(expense => expense.id));
    }
  };
  
  // Delete selected expenses
  const deleteSelectedExpenses = () => {
    if (selectedExpenses.length === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir ${selectedExpenses.length} despesa(s)?`)) {
      selectedExpenses.forEach(id => removeExpense(id));
      setSelectedExpenses([]);
    }
  };
  
  // Handle input changes for new expense
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Handle select changes for new expense
  const handleSelectChange = (name: string, value: string) => {
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save new expense
  const saveNewExpense = () => {
    if (!newExpense.device_id || !newExpense.description || newExpense.amount <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    addExpense({
      ...newExpense,
      date: date.toISOString()
    });
    
    // Reset form
    setNewExpense({
      device_id: '',
      description: '',
      amount: 0,
      date: new Date().toISOString(),
      category: 'Reparo'
    });
    setDate(new Date());
    setShowNewExpenseDialog(false);
  };
  
  // Get available devices (only show available devices in the dropdown)
  const availableDevices = devices.filter(device => device.status === 'available');

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setDeviceFilter('all');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Despesas</h1>
          
          <div className="flex gap-2">
            {!isMobile && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            )}
            <Button onClick={() => setShowNewExpenseDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {isMobile ? "Nova" : "Nova Despesa"}
            </Button>
          </div>
        </div>
        
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-sm text-gray-500">Total de Despesas</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-500">{filteredExpenses.length} despesas registradas</p>
        </div>
        
        {/* Filters - Desktop */}
        {!isMobile && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-auto flex-1">
              <Input
                placeholder="Buscar despesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-80">
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os dispositivos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dispositivos</SelectItem>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.model} ({device.color}, {device.storage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedExpenses.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={deleteSelectedExpenses}
                className="ml-auto"
              >
                <Trash className="mr-2 h-4 w-4" />
                Excluir Selecionados ({selectedExpenses.length})
              </Button>
            )}
          </div>
        )}
        
        {/* Filters - Mobile */}
        {isMobile && (
          <div className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filtrar Despesas</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Dispositivo</Label>
                    <Select value={deviceFilter} onValueChange={(value) => {
                      setDeviceFilter(value);
                      setShowFilterSheet(false);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os dispositivos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os dispositivos</SelectItem>
                        {devices.map(device => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.model} ({device.color})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {(deviceFilter !== 'all' || searchTerm) && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        clearFilters();
                        setShowFilterSheet(false);
                      }}
                      className="w-full"
                    >
                      <X size={16} className="mr-2" />
                      Limpar Filtros
                    </Button>
                  )}
                  
                  {selectedExpenses.length > 0 && (
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        deleteSelectedExpenses();
                        setShowFilterSheet(false);
                      }}
                      className="w-full"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir Selecionados ({selectedExpenses.length})
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            {selectedExpenses.length > 0 && (
              <Button 
                variant="destructive" 
                size="icon"
                onClick={deleteSelectedExpenses}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        
        {/* Mobile Expenses List */}
        {isMobile && (
          <div className="space-y-3 mb-6">
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8 bg-card border rounded-lg">
                <p className="text-muted-foreground">Nenhuma despesa encontrada</p>
              </div>
            ) : (
              filteredExpenses.map((expense) => {
                const device = getDeviceById(expense.device_id);
                const isSelected = selectedExpenses.includes(expense.id);
                
                return (
                  <Card key={expense.id} className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="p-0">
                      <div className="p-4 border-b flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleExpenseSelection(expense.id)}
                            aria-label={`Select expense ${expense.id}`}
                          />
                          <div>
                            <div className="font-medium">{expense.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-bold">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>
                      
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-muted-foreground" />
                          <Badge variant="outline">{expense.category}</Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {device?.model || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="p-4 pt-0 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => removeExpense(expense.id)}>
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
        )}
        
        {/* Desktop Expenses Table */}
        {!isMobile && (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        filteredExpenses.length > 0 && 
                        selectedExpenses.length === filteredExpenses.length
                      }
                      onCheckedChange={selectAllExpenses}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhuma despesa encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => {
                    const device = getDeviceById(expense.device_id);
                    
                    return (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedExpenses.includes(expense.id)}
                            onCheckedChange={() => toggleExpenseSelection(expense.id)}
                            aria-label={`Select expense ${expense.id}`}
                          />
                        </TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{device?.model || 'N/A'}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => removeExpense(expense.id)}>
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
        )}
        
        {/* New Expense Dialog */}
        <Dialog open={showNewExpenseDialog} onOpenChange={setShowNewExpenseDialog}>
          <DialogContent className={isMobile ? "w-[calc(100%-32px)] p-4" : "sm:max-w-[500px]"}>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Despesa</DialogTitle>
              <DialogDescription>
                Registre uma despesa relacionada a um dispositivo
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="device">Dispositivo *</Label>
                <Select 
                  value={newExpense.device_id} 
                  onValueChange={(value) => handleSelectChange('device_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDevices.length === 0 ? (
                      <SelectItem value="no-devices">Nenhum dispositivo disponível</SelectItem>
                    ) : (
                      availableDevices.map(device => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.model} ({device.color}, {device.storage})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Ex: Película de proteção"
                  value={newExpense.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newExpense.amount || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reparo">Reparo</SelectItem>
                    <SelectItem value="Acessório">Acessório</SelectItem>
                    <SelectItem value="Frete">Frete</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewExpenseDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={saveNewExpense}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Expenses;
