
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
  // Function to get appropriate color background based on color name
  const getColorBackground = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'preto': 'bg-gray-900',
      'branco': 'bg-gray-100 border border-gray-300',
      'prata': 'bg-gray-300',
      'dourado': 'bg-yellow-400',
      'azul': 'bg-blue-500',
      'verde': 'bg-green-500',
      'vermelho': 'bg-red-500',
      'roxo': 'bg-purple-500',
      'rosa': 'bg-pink-500',
      // Add more colors as needed
    };
    
    // Default to gray if color not in map
    return colorMap[colorName.toLowerCase()] || 'bg-gray-500';
  };
  
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
            <span className={`inline-block h-4 w-4 rounded-full ${getColorBackground(color)} mr-2`}></span>
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
