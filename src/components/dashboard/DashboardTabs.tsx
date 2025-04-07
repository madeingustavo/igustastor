
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesTab } from './SalesTab';
import { ExpensesTab } from './ExpensesTab';
import { AlertsTab } from './AlertsTab';

export const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="vendas" className="space-y-4">
      <TabsList className="bg-muted">
        <TabsTrigger value="vendas">Vendas</TabsTrigger>
        <TabsTrigger value="despesas">Despesas</TabsTrigger>
        <TabsTrigger value="alertas">Alertas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="vendas">
        <SalesTab />
      </TabsContent>
      
      <TabsContent value="despesas">
        <ExpensesTab />
      </TabsContent>
      
      <TabsContent value="alertas">
        <AlertsTab />
      </TabsContent>
    </Tabs>
  );
};
