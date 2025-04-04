
import React from 'react';
import { Button } from '@/components/ui/button';

interface SpecificationsCardProps {
  model: string;
  color: string;
  storage: string;
  onChangeSpecs: () => void;
}

const SpecificationsCard: React.FC<SpecificationsCardProps> = ({
  model,
  color,
  storage,
  onChangeSpecs
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium mb-2">Especificações selecionadas</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Modelo</p>
          <p className="font-medium">{model}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cor</p>
          <div className="flex items-center">
            <span className="inline-block h-4 w-4 rounded-full bg-yellow-400 mr-2"></span>
            <p className="font-medium">{color}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Armazenamento</p>
          <p className="font-medium">{storage}</p>
        </div>
      </div>
      <div className="mt-2 text-right">
        <Button 
          variant="link" 
          onClick={onChangeSpecs}
          className="text-blue-500 p-0"
        >
          Alterar especificações
        </Button>
      </div>
    </div>
  );
};

export default SpecificationsCard;
