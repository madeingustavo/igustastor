
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useDevices } from '../../hooks/useDevices';
import { useSettings } from '../../hooks/useSettings';

export const AlertsTab: React.FC = () => {
  const { getOldDevices } = useDevices();
  const { formatCurrency } = useSettings();
  
  const oldDevices = getOldDevices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos Antigos em Estoque</CardTitle>
        <CardDescription>Dispositivos que estão há mais de 30 dias em estoque</CardDescription>
      </CardHeader>
      <CardContent>
        {oldDevices.length > 0 ? (
          <div className="space-y-4">
            {oldDevices.map(device => (
              <div key={device.id} className="flex items-start justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">{device.model} ({device.storage}, {device.color})</h3>
                  <p className="text-sm text-muted-foreground">
                    Em estoque desde: {new Date(device.created_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Preço: {formatCurrency(device.sale_price)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/devices/${device.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum dispositivo antigo em estoque</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Todos os dispositivos em estoque foram adicionados nos últimos 30 dias.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
