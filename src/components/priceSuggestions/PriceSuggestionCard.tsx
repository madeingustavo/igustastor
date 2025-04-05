
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Smartphone } from 'lucide-react';
import { PriceSuggestion } from '@/hooks/usePriceSuggestions';

interface PriceSuggestionCardProps {
  suggestion: PriceSuggestion;
  formatCurrency: (value: number) => string;
}

const PriceSuggestionCard: React.FC<PriceSuggestionCardProps> = ({ 
  suggestion, 
  formatCurrency 
}) => {
  if (!suggestion.model || !suggestion.storage) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Smartphone className="h-5 w-5" />
          <h3 className="text-lg font-medium">Sugestão de Preço</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Consulte valores de referência para compra de iPhones
          </p>
        </CardContent>
      </Card>
    );
  }

  const { minPrice, maxPrice, purchaseCount } = suggestion.priceReference || { 
    minPrice: 0, 
    maxPrice: 0, 
    purchaseCount: 0 
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Smartphone className="h-5 w-5" />
        <h3 className="text-lg font-medium">Sugestão de Preço</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Consulte valores de referência para compra de iPhones
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Modelo do iPhone</label>
              <div className="rounded-md border p-2">{suggestion.model}</div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Capacidade de Armazenamento</label>
              <div className="rounded-md border p-2">{suggestion.storage}</div>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-base font-medium mb-2">Valores de Referência:</h4>
            
            {suggestion.priceReference ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="text-green-600 h-5 w-5" />
                    <span>Menor preço de compra:</span>
                  </div>
                  <span className="font-semibold text-green-600">{formatCurrency(minPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="text-red-600 h-5 w-5" />
                    <span>Maior preço de compra:</span>
                  </div>
                  <span className="font-semibold text-red-600">{formatCurrency(maxPrice)}</span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Baseado em {purchaseCount} {purchaseCount === 1 ? 'compra anterior' : 'compras anteriores'}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Não há dados suficientes para este modelo e capacidade.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSuggestionCard;
