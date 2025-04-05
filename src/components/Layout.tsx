
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { 
  BarChart3, 
  Settings, 
  Home, 
  Smartphone, 
  DollarSign, 
  CreditCard, 
  Users, 
  Truck, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { path: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { path: '/devices', icon: <Smartphone size={20} />, text: 'Dispositivos' },
    { path: '/sales', icon: <DollarSign size={20} />, text: 'Vendas' },
    { path: '/expenses', icon: <CreditCard size={20} />, text: 'Despesas' },
    { path: '/customers', icon: <Users size={20} />, text: 'Clientes' },
    { path: '/suppliers', icon: <Truck size={20} />, text: 'Fornecedores' },
    { path: '/reports', icon: <BarChart3 size={20} />, text: 'Relatórios' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Configurações' }, // Novo link para configurações
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-1 p-3">
            {navLinks.map((link) => (
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

        {/* Mobile sidebar */}
        <div className="md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed z-20 bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <Menu size={24} />
          </button>

          {/* Mobile sidebar overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Mobile sidebar drawer */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-1 p-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  icon={link.icon}
                  text={link.text}
                  isActive={location.pathname === link.path}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
