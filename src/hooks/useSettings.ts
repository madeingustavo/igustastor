
import { useState, useEffect } from 'react';
import { AppStorageManager } from '../storage/AppStorageManager';
import { toast } from 'sonner';

interface Settings {
  theme: 'light' | 'dark';
  lowStockAlert: number;
  oldDevicesAlert: number; // Novo campo para alerta de dispositivos antigos
  currency: string;
  language: string;
  notifications: boolean;
  backupReminders: boolean;
  companyName: string;
  companyLogo?: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  lowStockAlert: 5,
  oldDevicesAlert: 30, // 30 dias por padrão
  currency: 'BRL',
  language: 'pt-BR',
  notifications: true,
  backupReminders: true,
  companyName: 'Gestão de iPhones',
  contactInfo: {
    phone: '',
    email: '',
    address: ''
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = AppStorageManager.getSettings();
    return { ...DEFAULT_SETTINGS, ...savedSettings };
  });

  // Sync with localStorage whenever settings change
  useEffect(() => {
    AppStorageManager.saveSettings(settings);
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    toast.success('Configurações atualizadas com sucesso!');
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    toast.success(`Tema alterado para ${newTheme === 'light' ? 'claro' : 'escuro'}.`);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency
    }).format(value);
  };

  // Reset settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success('Configurações restauradas para os valores padrão.');
  };

  return {
    settings,
    updateSettings,
    toggleTheme,
    formatCurrency,
    resetSettings
  };
};
