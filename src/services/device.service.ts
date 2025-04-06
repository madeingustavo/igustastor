
import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import { Device } from '../types/schema';
import { toast } from 'sonner';

export interface DeviceFilter {
  search?: string;
  status?: string;
  model?: string;
  supplier_id?: string;
  storage?: string;
  color?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DeviceStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  inventory_value: number;
  potential_sales_value: number;
  potential_profit: number;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export interface DeviceSearchResult {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export class DeviceService {
  public async getDevices(filters: DeviceFilter = {}): Promise<DeviceSearchResult> {
    try {
      return await apiClient.get<DeviceSearchResult>(API_ENDPOINTS.DEVICES.LIST, filters);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao carregar dispositivos.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async getAvailableDevices(filters: DeviceFilter = {}): Promise<DeviceSearchResult> {
    try {
      return await apiClient.get<DeviceSearchResult>(API_ENDPOINTS.DEVICES.AVAILABLE, filters);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao carregar dispositivos disponíveis.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async getDeviceById(id: string): Promise<Device> {
    try {
      return await apiClient.get<Device>(API_ENDPOINTS.DEVICES.DETAILS(id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao carregar detalhes do dispositivo.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async createDevice(deviceData: Partial<Device>): Promise<Device> {
    try {
      const result = await apiClient.post<Device>(API_ENDPOINTS.DEVICES.CREATE, deviceData);
      toast.success('Dispositivo adicionado com sucesso!');
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao criar dispositivo.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async updateDevice(id: string, deviceData: Partial<Device>): Promise<Device> {
    try {
      const result = await apiClient.put<Device>(API_ENDPOINTS.DEVICES.UPDATE(id), deviceData);
      toast.success('Dispositivo atualizado com sucesso!');
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao atualizar dispositivo.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async deleteDevice(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DEVICES.DELETE(id));
      toast.success('Dispositivo removido com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao remover dispositivo.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async getDeviceStats(): Promise<DeviceStats> {
    try {
      return await apiClient.get<DeviceStats>(API_ENDPOINTS.DEVICES.STATS);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao carregar estatísticas de dispositivos.';
      toast.error(errorMessage);
      throw error;
    }
  }

  public async importDevices(file: File, onProgress?: (percentage: number) => void): Promise<ImportResult> {
    try {
      const result = await apiClient.uploadFile<ImportResult>(API_ENDPOINTS.DEVICES.IMPORT, file, onProgress);
      toast.success(`Importação concluída: ${result.success} dispositivos importados, ${result.failed} falhas.`);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha na importação de dispositivos.';
      toast.error(errorMessage);
      throw error;
    }
  }
}

export const deviceService = new DeviceService();
