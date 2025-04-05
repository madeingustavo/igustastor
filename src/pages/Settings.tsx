
import React from 'react';
import Layout from '../components/Layout';
import { useSettings } from '../hooks/useSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Moon, Sun, Languages, Bell } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const Settings = () => {
  const { settings, updateSettings, toggleTheme, resetSettings } = useSettings();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <Button variant="outline" onClick={resetSettings}>
            Restaurar Padrões
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Aparência e Idioma */}
          <Card>
            <CardHeader>
              <CardTitle>Aparência e Idioma</CardTitle>
              <CardDescription>Personalize a aparência e o idioma do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="theme">Tema Escuro</Label>
                  <span className="text-sm text-muted-foreground">
                    Alterne entre os temas claro e escuro
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Switch
                    id="theme"
                    checked={settings.theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings({ language: value })}
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => updateSettings({ currency: value })}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar (US$)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alertas e Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Notificações</CardTitle>
              <CardDescription>
                Configure os alertas e notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="notifications">Notificações</Label>
                  <span className="text-sm text-muted-foreground">
                    Habilitar notificações do sistema
                  </span>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="backupReminders">Lembretes de Backup</Label>
                  <span className="text-sm text-muted-foreground">
                    Receber lembretes para fazer backup dos dados
                  </span>
                </div>
                <Switch
                  id="backupReminders"
                  checked={settings.backupReminders}
                  onCheckedChange={(checked) =>
                    updateSettings({ backupReminders: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="lowStockAlert">Alerta de Estoque Baixo</Label>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <Input
                  id="lowStockAlert"
                  type="number"
                  value={settings.lowStockAlert}
                  onChange={(e) =>
                    updateSettings({ lowStockAlert: parseInt(e.target.value) || 0 })
                  }
                  min={0}
                />
                <p className="text-sm text-muted-foreground">
                  Número mínimo de dispositivos antes de alertar sobre estoque baixo
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="oldDevicesAlert">Alerta de Dispositivos Antigos (dias)</Label>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <Input
                  id="oldDevicesAlert"
                  type="number"
                  value={settings.oldDevicesAlert || 30}
                  onChange={(e) =>
                    updateSettings({ oldDevicesAlert: parseInt(e.target.value) || 30 })
                  }
                  min={1}
                />
                <p className="text-sm text-muted-foreground">
                  Número de dias após os quais um dispositivo é considerado antigo em estoque
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Defina as informações da sua empresa para recibos e documentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) =>
                    updateSettings({ companyName: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactInfo?.phone || ''}
                    onChange={(e) =>
                      updateSettings({
                        contactInfo: { ...settings.contactInfo, phone: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">E-mail</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactInfo?.email || ''}
                    onChange={(e) =>
                      updateSettings({
                        contactInfo: { ...settings.contactInfo, email: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddress">Endereço</Label>
                <Textarea
                  id="contactAddress"
                  value={settings.contactInfo?.address || ''}
                  onChange={(e) =>
                    updateSettings({
                      contactInfo: { ...settings.contactInfo, address: e.target.value }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
