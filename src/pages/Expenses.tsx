
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useExpenses } from '../hooks/useExpenses';
import { useDevices } from '../hooks/useDevices';
import { useSettings } from '../hooks/useSettings';
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
  PlusIcon, DotsHorizontalIcon, TrashIcon, 
  Cross2Icon, CheckIcon 
} from '@radix-ui/react-icons';
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  
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
      date: date.toISOString(),
      id: '',
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
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciador de Despesas</h1>
          
          <div className="flex gap-2">
            <Button variant="outline">
              Exportar CSV
            </Button>
            <Button onClick={() => setShowNewExpenseDialog(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </div>
        </div>
        
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-sm text-gray-500">Total de Despesas</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-500">{filteredExpenses.length} despesas registradas</p>
        </div>
        
        {/* Filters and Actions */}
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
              <TrashIcon className="mr-2 h-4 w-4" />
              Excluir Selecionados ({selectedExpenses.length})
            </Button>
          )}
        </div>
        
        {/* Expenses Table */}
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
                              <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => removeExpense(expense.id)}>
                              <TrashIcon className="mr-2 h-4 w-4" />
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
        
        {/* New Expense Dialog */}
        <Dialog open={showNewExpenseDialog} onOpenChange={setShowNewExpenseDialog}>
          <DialogContent className="sm:max-w-[500px]">
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
                      <SelectItem value="" disabled>
                        Nenhum dispositivo disponível
                      </SelectItem>
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
