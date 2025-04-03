
import React from 'react';

interface TopModel {
  model: string;
  revenue: number;
  sales: number;
}

interface TopModelsListProps {
  models: TopModel[];
}

export const TopModelsList: React.FC<TopModelsListProps> = ({ models }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Color bullets
  const bulletColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-purple-500'
  ];

  return (
    <div className="space-y-4">
      {models.map((model, index) => (
        <div key={model.model} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${bulletColors[index % bulletColors.length]}`} />
            <div>
              <div className="font-medium">{model.model}</div>
              <div className="text-xs text-muted-foreground">{model.sales} vendas</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatCurrency(model.revenue)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
