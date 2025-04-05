
import React from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { usePriceSuggestions } from '@/hooks/usePriceSuggestions';
import { useSettings } from '@/hooks/useSettings';
import PriceSuggestionCard from '@/components/priceSuggestions/PriceSuggestionCard';
import PriceSuggestionInstructions from '@/components/priceSuggestions/PriceSuggestionInstructions';

const PriceSuggestions: React.FC = () => {
  const { 
    selectedModel,
    setSelectedModel,
    selectedStorage,
    setSelectedStorage,
    uniqueModels,
    availableStorage,
    currentSuggestion
  } = usePriceSuggestions();
  
  const { formatCurrency } = useSettings();

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" asChild>
            <Link to="/devices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Dispositivos
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Sugestões de Preço</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PriceSuggestionCard 
              suggestion={currentSuggestion} 
              formatCurrency={formatCurrency} 
            />

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo do iPhone</label>
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueModels.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Capacidade de Armazenamento</label>
                <Select
                  value={selectedStorage}
                  onValueChange={setSelectedStorage}
                  disabled={!selectedModel || availableStorage.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedModel ? "Selecione um modelo primeiro" : "Selecione a capacidade"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStorage.map(storage => (
                      <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <PriceSuggestionInstructions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PriceSuggestions;
