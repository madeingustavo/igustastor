
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  Phone, 
  User,
  Calendar,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { useDevices } from '@/hooks/useDevices';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Define customer form schema
const customerFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const Customers = () => {
  const { 
    customers, 
    addCustomer, 
    updateCustomer, 
    removeCustomer, 
    getCustomerById, 
    searchCustomers 
  } = useCustomers();
  const { sales, getSalesByCustomerId } = useSales();
  const { getDeviceById } = useDevices();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Filter customers by search query
  const filteredCustomers = searchQuery 
    ? searchCustomers(searchQuery) 
    : customers;
  
  // Add customer form
  const addForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    }
  });
  
  // Edit customer form
  const editForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    }
  });
  
  // Add new customer
  const handleAddCustomer = (data: CustomerFormValues) => {
    try {
      addCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        notes: data.notes || ''
      });
      
      setShowAddDialog(false);
      addForm.reset();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error('Erro ao adicionar cliente. Tente novamente.');
    }
  };
  
  // Open edit dialog
  const handleOpenEditDialog = (customerId: string) => {
    const customer = getCustomerById(customerId);
    if (!customer) return;
    
    setSelectedCustomer(customerId);
    
    editForm.reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      notes: customer.notes
    });
    
    setShowEditDialog(true);
  };
  
  // Update customer
  const handleUpdateCustomer = (data: CustomerFormValues) => {
    if (!selectedCustomer) return;
    
    try {
      updateCustomer(selectedCustomer, {
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        notes: data.notes || ''
      });
      
      setShowEditDialog(false);
      editForm.reset();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente. Tente novamente.');
    }
  };
  
  // Delete customer
  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    try {
      removeCustomer(selectedCustomer);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente. Tente novamente.');
    }
  };
  
  // Open customer details
  const handleOpenDetails = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowDetailsDialog(true);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Get customer purchases
  const getCustomerPurchases = (customerId: string) => {
    return getSalesByCustomerId(customerId);
  };
  
  // Get purchase details
  const getPurchaseDetails = (deviceId: string) => {
    return getDeviceById(deviceId);
  };
  
  // Calculate customer total revenue
  const getCustomerTotalRevenue = (customerId: string) => {
    const customerSales = getSalesByCustomerId(customerId);
    return customerSales.reduce((total, sale) => total + sale.sale_price, 0);
  };
  
  // Calculate customer total profit
  const getCustomerTotalProfit = (customerId: string) => {
    const customerSales = getSalesByCustomerId(customerId);
    return customerSales.reduce((total, sale) => total + sale.profit, 0);
  };

  return (
    <Layout>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Customers table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Compras</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const purchaseCount = getCustomerPurchases(customer.id).length;
                    
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.email || '-'}</TableCell>
                        <TableCell>{purchaseCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleOpenDetails(customer.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(customer.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedCustomer(customer.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Add customer dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddCustomer)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do cliente" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço (opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Endereço completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Informações adicionais" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddDialog(false);
                  addForm.reset();
                }}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Cliente</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit customer dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateCustomer)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do cliente" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço (opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Endereço completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Informações adicionais" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setShowEditDialog(false);
                  editForm.reset();
                }}>
                  Cancelar
                </Button>
                <Button type="submit">Atualizar Cliente</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
          </DialogHeader>
          <p className="py-4">Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Customer details dialog */}
      {selectedCustomer && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowDetailsDialog(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Detalhes do Cliente</DialogTitle>
              </div>
            </DialogHeader>
            
            {(() => {
              const customer = getCustomerById(selectedCustomer);
              if (!customer) return <p>Cliente não encontrado</p>;
              
              const customerPurchases = getCustomerPurchases(customer.id);
              const totalRevenue = getCustomerTotalRevenue(customer.id);
              const totalProfit = getCustomerTotalProfit(customer.id);
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Informações do Cliente</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nome:</p>
                          <p className="text-lg">{customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Telefone:</p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p>{customer.phone}</p>
                          </div>
                        </div>
                        {customer.email && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email:</p>
                            <p>{customer.email}</p>
                          </div>
                        )}
                        {customer.address && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Endereço:</p>
                            <p>{customer.address}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Data de cadastro:</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p>{format(new Date(customer.created_date), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                        {customer.notes && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Observações:</p>
                            <p>{customer.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            setShowDetailsDialog(false);
                            handleOpenEditDialog(customer.id);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Dados do Cliente
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resumo de Compras</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total de Compras</p>
                            <p className="text-2xl font-bold">{customerPurchases.length}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Valor Médio</p>
                            <p className="text-2xl font-bold">
                              {customerPurchases.length > 0
                                ? formatCurrency(totalRevenue / customerPurchases.length)
                                : 'R$ 0,00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Gasto</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Lucro Gerado</p>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalProfit)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Histórico de Compras</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customerPurchases.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">
                          Este cliente ainda não realizou nenhuma compra
                        </p>
                      ) : (
                        <Tabs defaultValue="list">
                          <TabsList className="mb-4">
                            <TabsTrigger value="list">Lista</TabsTrigger>
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="list">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Dispositivo</TableHead>
                                  <TableHead>Preço de Venda</TableHead>
                                  <TableHead>Lucro</TableHead>
                                  <TableHead>Método de Pagamento</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customerPurchases.map(purchase => {
                                  const device = getPurchaseDetails(purchase.device_id);
                                  
                                  return (
                                    <TableRow key={purchase.id}>
                                      <TableCell>{format(new Date(purchase.sale_date), 'dd/MM/yyyy')}</TableCell>
                                      <TableCell>{device ? device.model : 'Dispositivo não encontrado'}</TableCell>
                                      <TableCell>{formatCurrency(purchase.sale_price)}</TableCell>
                                      <TableCell>{formatCurrency(purchase.profit)}</TableCell>
                                      <TableCell className="capitalize">
                                        {purchase.payment_method === 'cash' ? 'Dinheiro' :
                                         purchase.payment_method === 'credit' ? 'Crédito' :
                                         purchase.payment_method === 'debit' ? 'Débito' :
                                         purchase.payment_method === 'pix' ? 'PIX' : 
                                         purchase.payment_method === 'transfer' ? 'Transferência' : 
                                         purchase.payment_method}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TabsContent>
                          
                          <TabsContent value="details">
                            <div className="space-y-4">
                              {customerPurchases.map(purchase => {
                                const device = getPurchaseDetails(purchase.device_id);
                                
                                return (
                                  <Card key={purchase.id}>
                                    <CardHeader className="pb-2">
                                      <div className="flex justify-between items-center">
                                        <CardTitle className="text-base">
                                          Compra #{purchase.id.slice(-6).toUpperCase()}
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                          {format(new Date(purchase.sale_date), 'dd/MM/yyyy')}
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm font-medium">Dispositivo</p>
                                          <p className="text-muted-foreground">{device ? device.model : 'Dispositivo não encontrado'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Preço de Venda</p>
                                          <p className="text-muted-foreground">{formatCurrency(purchase.sale_price)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Lucro</p>
                                          <p className="text-muted-foreground">{formatCurrency(purchase.profit)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Método de Pagamento</p>
                                          <p className="text-muted-foreground capitalize">
                                            {purchase.payment_method === 'cash' ? 'Dinheiro' :
                                             purchase.payment_method === 'credit' ? 'Crédito' :
                                             purchase.payment_method === 'debit' ? 'Débito' :
                                             purchase.payment_method === 'pix' ? 'PIX' : 
                                             purchase.payment_method === 'transfer' ? 'Transferência' : 
                                             purchase.payment_method}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Customers;
