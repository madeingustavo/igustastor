
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { 
  Home, 
  Smartphone, 
  DollarSign, 
  CreditCard, 
  Users, 
  Truck, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavLinkProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick?: () => void;
};

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, isActive, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
        isActive ? 'text-white bg-blue-600' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { path: '/devices', icon: <Smartphone size={20} />, text: 'Dispositivos' },
    { path: '/sales', icon: <DollarSign size={20} />, text: 'Vendas' },
    { path: '/customers', icon: <Users size={20} />, text: 'Clientes' },
    { path: '/reports', icon: <BarChart3 size={20} />, text: 'Relatórios' },
    { path: '/expenses', icon: <CreditCard size={20} />, text: 'Despesas' },
    { path: '/suppliers', icon: <Truck size={20} />, text: 'Fornecedores' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Configurações' },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={toggleMenu} />
      
      <div className="flex flex-1">
        {/* Desktop sidebar - always visible */}
        <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-1 p-3">
            {navItems.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                text={link.text}
                isActive={location.pathname === link.path}
              />
            ))}
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={toggleMenu} />
        )}

        {/* Mobile sidebar - shown as dialog */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-3 space-y-2">
            {/* Menu Items for mobile */}
            {navItems.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                text={link.text}
                isActive={location.pathname === link.path}
                onClick={toggleMenu}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
