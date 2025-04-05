
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const PriceSuggestionInstructions: React.FC = () => {
  return (
    <Card className="w-full bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">
          Como utilizar:
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center font-medium">
              1
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              Selecione um modelo de iPhone na lista
            </p>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center font-medium">
              2
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              Escolha a capacidade de armazenamento correspondente
            </p>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center font-medium">
              3
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              Veja as referências de preço baseadas no histórico de compras do sistema
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-blue-700 dark:text-blue-300">
          Esta ferramenta utiliza dados de compras anteriores para fornecer referências de preço, 
          ajudando você a tomar decisões mais informadas na compra de iPhones.
        </p>
      </CardContent>
    </Card>
  );
};

export default PriceSuggestionInstructions;
