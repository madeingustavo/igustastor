
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { Moon, Sun, Package, Users, TrendingUp, Settings, FileText, DollarSign, Home, Truck, Menu, X, LogOut, Download, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { AppStorageManager } from '../storage/AppStorageManager';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '../hooks/useSettings';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useTheme();
  const location = useLocation();
  const { settings } = useSettings();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Dispositivos', path: '/devices', icon: Package },
    { name: 'Vendas', path: '/sales', icon: TrendingUp },
    { name: 'Clientes', path: '/customers', icon: Users },
    { name: 'Fornecedores', path: '/suppliers', icon: Truck },
    { name: 'Despesas', path: '/expenses', icon: DollarSign },
    { name: 'Relatórios', path: '/reports', icon: FileText },
    { name: 'Configurações', path: '/settings', icon: Settings },
  ];

  // Handle file import
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleExportData = () => {
    AppStorageManager.exportData();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await AppStorageManager.importData(file);
    if (success) {
      alert('Dados importados com sucesso! A página será recarregada.');
      window.location.reload();
    } else {
      alert('Falha ao importar dados. Verifique o formato do arquivo.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const NavLink = ({ item, onClick }: { item: typeof menuItems[0], onClick?: () => void }) => (
    <Link 
      to={item.path} 
      className={`flex items-center px-3 py-2 rounded-md text-sm ${
        location.pathname === item.path 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      }`}
      onClick={onClick}
    >
      <item.icon className="h-4 w-4 mr-2" />
      {item.name}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6">
                  <h2 className="text-lg font-semibold">{settings.companyName}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão</p>
                </div>
                <Separator />
                <div className="py-4">
                  <nav className="flex flex-col gap-1 px-2">
                    {menuItems.map((item) => (
                      <SheetClose asChild key={item.path}>
                        <NavLink item={item} />
                      </SheetClose>
                    ))}
                  </nav>
                </div>
                <Separator />
                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleExportData} variant="outline" size="sm" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Dados
                    </Button>
                    <Button onClick={handleImportClick} variant="outline" size="sm" className="justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Dados
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="text-xl font-semibold hidden md:block">
              {settings.companyName}
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {menuItems.slice(0, 5).map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={toggleTheme} variant="ghost" size="icon">
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
            
            {/* More menu for desktop */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Mais
                  <Menu className="h-4 w-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4 py-4">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <nav className="flex flex-col gap-2">
                    {menuItems.slice(5).map((item) => (
                      <SheetClose asChild key={item.path}>
                        <Link 
                          to={item.path} 
                          className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-accent"
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Dados</h3>
                    <Button onClick={handleExportData} variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Dados
                    </Button>
                    <Button onClick={handleImportClick} variant="outline" size="sm" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Dados
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImport} 
                      accept=".json" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="py-4 border-t px-4 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-2 md:gap-0">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}</p>
          <p className="text-xs">Sistema de Gestão de Vendas de iPhones</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
