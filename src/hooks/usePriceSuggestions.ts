
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api.client';
import { API_ENDPOINTS } from '../config/api.config';
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
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');

  // Query para obter modelos únicos
  const { data: uniqueModels = [] } = useQuery({
    queryKey: ['device-models'],
    queryFn: async () => {
      try {
        // Tentativa de obter modelos da API
        const response = await apiClient.get<string[]>('/api/devices/models');
        return response;
      } catch (error) {
        console.error('Erro ao buscar modelos da API, usando dados locais', error);
        // Fallback para dados locais se a API falhar
        const { devices } = await import('../hooks/useDevices').then(m => m.useDevices());
        const models = new Set<string>();
        devices.forEach(device => {
          if (device.model) models.add(device.model);
        });
        return Array.from(models).sort();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para obter capacidades de armazenamento para o modelo selecionado
  const { data: availableStorage = [] } = useQuery({
    queryKey: ['device-storage', selectedModel],
    queryFn: async () => {
      if (!selectedModel) return [];
      
      try {
        // Tentativa de obter capacidades da API
        const response = await apiClient.get<string[]>(`/api/devices/storage?model=${selectedModel}`);
        return response;
      } catch (error) {
        console.error('Erro ao buscar capacidades da API, usando dados locais', error);
        // Fallback para dados locais se a API falhar
        const { devices } = await import('../hooks/useDevices').then(m => m.useDevices());
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
      }
    },
    enabled: !!selectedModel,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para obter referência de preço para o modelo e armazenamento selecionados
  const { data: priceReference, refetch: refetchPriceReference } = useQuery({
    queryKey: ['price-reference', selectedModel, selectedStorage],
    queryFn: async () => {
      if (!selectedModel || !selectedStorage) return null;
      
      try {
        // Obter referência de preço da API
        const response = await apiClient.get<PriceReference>(
          `/api/devices/price-reference?model=${selectedModel}&storage=${selectedStorage}`
        );
        return response;
      } catch (error) {
        console.error('Erro ao buscar referência de preço da API, usando dados locais', error);
        // Fallback para dados locais se a API falhar
        const { devices } = await import('../hooks/useDevices').then(m => m.useDevices());
        const relevantDevices = devices.filter(
          (device: Device) => 
            device.model === selectedModel && 
            device.storage === selectedStorage
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
      }
    },
    enabled: !!selectedModel && !!selectedStorage,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Função para obter a sugestão de preço atual
  const currentSuggestion = useMemo((): PriceSuggestion => {
    return {
      model: selectedModel,
      storage: selectedStorage,
      priceReference: priceReference || null
    };
  }, [selectedModel, selectedStorage, priceReference]);

  return {
    selectedModel,
    setSelectedModel,
    selectedStorage,
    setSelectedStorage,
    uniqueModels,
    availableStorage,
    currentSuggestion,
    refetchPriceReference
  };
};
