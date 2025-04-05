
import { useState, useCallback, useMemo } from 'react';
import { useDevices } from './useDevices';
import { Device } from '../types/schema';

// Definindo tipos para as sugestões de preço
export interface PriceReference {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  purchaseCount: number;
}

export interface PriceSuggestion {
  model: string;
  storage: string;
  priceReference: PriceReference | null;
}

export const usePriceSuggestions = () => {
  const { devices } = useDevices();
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');

  // Função para obter modelos únicos
  const uniqueModels = useMemo(() => {
    const models = new Set<string>();
    devices.forEach(device => {
      if (device.model) models.add(device.model);
    });
    return Array.from(models).sort();
  }, [devices]);

  // Função para obter capacidades de armazenamento únicas para o modelo selecionado
  const availableStorage = useMemo(() => {
    if (!selectedModel) return [];
    
    const storage = new Set<string>();
    devices
      .filter(device => device.model === selectedModel)
      .forEach(device => {
        if (device.storage) storage.add(device.storage);
      });
    
    return Array.from(storage).sort((a, b) => {
      // Ordenar por capacidade numérica (removendo 'GB' e convertendo para número)
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      return numA - numB;
    });
  }, [selectedModel, devices]);

  // Função para calcular referências de preço para modelo/armazenamento específicos
  const getPriceReference = useCallback(
    (model: string, storage: string): PriceReference | null => {
      if (!model || !storage) return null;

      const relevantDevices = devices.filter(
        (device: Device) => 
          device.model === model && 
          device.storage === storage
      );

      if (relevantDevices.length === 0) return null;

      const purchasePrices = relevantDevices.map(d => d.purchase_price).filter(Boolean);
      
      if (purchasePrices.length === 0) return null;

      const minPrice = Math.min(...purchasePrices);
      const maxPrice = Math.max(...purchasePrices);
      const avgPrice = purchasePrices.reduce((sum, price) => sum + price, 0) / purchasePrices.length;

      return {
        minPrice,
        maxPrice,
        avgPrice,
        purchaseCount: purchasePrices.length
      };
    },
    [devices]
  );

  // Função para obter a sugestão de preço atual
  const currentSuggestion = useMemo((): PriceSuggestion => {
    return {
      model: selectedModel,
      storage: selectedStorage,
      priceReference: getPriceReference(selectedModel, selectedStorage)
    };
  }, [selectedModel, selectedStorage, getPriceReference]);

  return {
    selectedModel,
    setSelectedModel,
    selectedStorage,
    setSelectedStorage,
    uniqueModels,
    availableStorage,
    currentSuggestion,
    getPriceReference
  };
};
