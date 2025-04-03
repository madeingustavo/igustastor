
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  Phone, 
  Building,
  Calendar,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useDevices } from '@/hooks/useDevices';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Define supplier form schema
const supplierFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const Suppliers = () => {
  const { 
    suppliers, 
    addSupplier, 
    updateSupplier, 
    removeSupplier, 
    getSupplierById, 
    searchSuppliers 
  } = useSuppliers();
  const { devices, getDevicesBySupplier } = useDevices();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Filter suppliers by search query
  const filteredSuppliers = searchQuery 
    ? searchSuppliers(searchQuery) 
    : suppliers;
  
  // Add supplier form
  const addForm = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    }
  });
  
  // Edit supplier form
  const editForm = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    }
  });
  
  // Add new supplier
  const handleAddSupplier = (data: SupplierFormValues) => {
    try {
      addSupplier({
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        notes: data.notes || ''
      });
      
      setShowAddDialog(false);
      addForm.reset();
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      toast.error('Erro ao adicionar fornecedor. Tente novamente.');
    }
  };
  
  // Open edit dialog
  const handleOpenEditDialog = (supplierId: string) => {
    const supplier = getSupplierById(supplierId);
    if (!supplier) return;
    
    setSelectedSupplier(supplierId);
    
    editForm.reset({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      notes: supplier.notes
    });
    
    setShowEditDialog(true);
  };
  
  // Update supplier
  const handleUpdateSupplier = (data: SupplierFormValues) => {
    if (!selectedSupplier) return;
    
    try {
      updateSupplier(selectedSupplier, {
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        address: data.address || '',
        notes: data.notes || ''
      });
      
      setShowEditDialog(false);
      editForm.reset();
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor. Tente novamente.');
    }
  };
  
  // Delete supplier
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    
    try {
      removeSupplier(selectedSupplier);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      toast.error('Erro ao excluir fornecedor. Tente novamente.');
    }
  };
  
  // Open supplier details
  const handleOpenDetails = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setShowDetailsDialog(true);
  };

  // Get supplier devices
  const getSupplierDevices = (supplierId: string) => {
    return devices.filter(device => device.supplier_id === supplierId);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <Layout>
      <div className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fornecedores</h1>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Fornecedor
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
        
        {/* Suppliers table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dispositivos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum fornecedor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => {
                    const deviceCount = getSupplierDevices(supplier.id).length;
                    
                    return (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.email || '-'}</TableCell>
                        <TableCell>{deviceCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleOpenDetails(supplier.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(supplier.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedSupplier(supplier.id);
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
      
      {/* Add supplier dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddSupplier)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do fornecedor" />
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
                <Button type="submit">Salvar Fornecedor</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit supplier dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Fornecedor</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateSupplier)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome do fornecedor" />
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
                <Button type="submit">Atualizar Fornecedor</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir Fornecedor</DialogTitle>
          </DialogHeader>
          <p className="py-4">Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Supplier details dialog */}
      {selectedSupplier && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowDetailsDialog(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DialogTitle>Detalhes do Fornecedor</DialogTitle>
              </div>
            </DialogHeader>
            
            {(() => {
              const supplier = getSupplierById(selectedSupplier);
              if (!supplier) return <p>Fornecedor não encontrado</p>;
              
              const supplierDevices = getSupplierDevices(supplier.id);
              const availableDevices = supplierDevices.filter(device => device.status === 'available');
              const soldDevices = supplierDevices.filter(device => device.status === 'sold');
              
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Informações do Fornecedor</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nome:</p>
                          <p className="text-lg">{supplier.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Telefone:</p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p>{supplier.phone}</p>
                          </div>
                        </div>
                        {supplier.email && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email:</p>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <p>{supplier.email}</p>
                            </div>
                          </div>
                        )}
                        {supplier.address && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Endereço:</p>
                            <p>{supplier.address}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Data de cadastro:</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p>{format(new Date(supplier.created_date), 'dd/MM/yyyy')}</p>
                          </div>
                        </div>
                        {supplier.notes && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Observações:</p>
                            <p>{supplier.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => {
                            setShowDetailsDialog(false);
                            handleOpenEditDialog(supplier.id);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Dados do Fornecedor
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resumo de Dispositivos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total de Dispositivos</p>
                            <p className="text-2xl font-bold">{supplierDevices.length}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Disponíveis</p>
                            <p className="text-2xl font-bold text-green-500">{availableDevices.length}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Vendidos</p>
                            <p className="text-2xl font-bold">{soldDevices.length}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Taxa de Venda</p>
                            <p className="text-2xl font-bold">
                              {supplierDevices.length > 0
                                ? `${((soldDevices.length / supplierDevices.length) * 100).toFixed(0)}%`
                                : '0%'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dispositivos do Fornecedor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {supplierDevices.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">
                          Este fornecedor ainda não possui dispositivos cadastrados
                        </p>
                      ) : (
                        <Tabs defaultValue="all">
                          <TabsList className="mb-4">
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="available">Disponíveis</TabsTrigger>
                            <TabsTrigger value="sold">Vendidos</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="all">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Modelo</TableHead>
                                  <TableHead>Condição</TableHead>
                                  <TableHead>Preço de Compra</TableHead>
                                  <TableHead>Preço de Venda</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {supplierDevices.map(device => (
                                  <TableRow key={device.id}>
                                    <TableCell>{device.model}</TableCell>
                                    <TableCell>{device.condition}</TableCell>
                                    <TableCell>{formatCurrency(device.purchase_price)}</TableCell>
                                    <TableCell>{formatCurrency(device.sale_price)}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={device.status === 'available' ? 'default' : 
                                                device.status === 'sold' ? 'destructive' : 
                                                'outline'}
                                      >
                                        {device.status === 'available' ? 'Disponível' : 
                                         device.status === 'sold' ? 'Vendido' : 
                                         device.status === 'reserved' ? 'Reservado' : 
                                         device.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TabsContent>
                          
                          <TabsContent value="available">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Modelo</TableHead>
                                  <TableHead>Condição</TableHead>
                                  <TableHead>Preço de Compra</TableHead>
                                  <TableHead>Preço de Venda</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {availableDevices.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                      Nenhum dispositivo disponível
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  availableDevices.map(device => (
                                    <TableRow key={device.id}>
                                      <TableCell>{device.model}</TableCell>
                                      <TableCell>{device.condition}</TableCell>
                                      <TableCell>{formatCurrency(device.purchase_price)}</TableCell>
                                      <TableCell>{formatCurrency(device.sale_price)}</TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </TabsContent>
                          
                          <TabsContent value="sold">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Modelo</TableHead>
                                  <TableHead>Condição</TableHead>
                                  <TableHead>Preço de Compra</TableHead>
                                  <TableHead>Preço de Venda</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {soldDevices.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                      Nenhum dispositivo vendido
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  soldDevices.map(device => (
                                    <TableRow key={device.id}>
                                      <TableCell>{device.model}</TableCell>
                                      <TableCell>{device.condition}</TableCell>
                                      <TableCell>{formatCurrency(device.purchase_price)}</TableCell>
                                      <TableCell>{formatCurrency(device.sale_price)}</TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
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

export default Suppliers;
