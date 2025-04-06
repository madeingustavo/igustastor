
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Smartphone, DollarSign, Users, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [theme, setTheme] = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { path: '/', icon: <Home className="mr-2 h-4 w-4" />, label: 'Dashboard' },
    { path: '/devices', icon: <Smartphone className="mr-2 h-4 w-4" />, label: 'Dispositivos' },
    { path: '/sales', icon: <DollarSign className="mr-2 h-4 w-4" />, label: 'Vendas' },
    { path: '/customers', icon: <Users className="mr-2 h-4 w-4" />, label: 'Clientes' },
    { path: '/reports', icon: <BarChart3 className="mr-2 h-4 w-4" />, label: 'Relatórios' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl text-primary">
            iGustaStore
          </Link>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link to={item.path} legacyBehavior passHref>
                    <NavigationMenuLink 
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "px-4 py-2 flex items-center text-sm font-medium",
                        isActive(item.path) ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100" : ""
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || 'G'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline-block">
              {user?.name || 'Gustavo'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
