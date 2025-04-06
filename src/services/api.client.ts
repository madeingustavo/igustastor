
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { toast } from 'sonner';

export class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const statusCode = error.response?.status;

        // Handle 401 Unauthorized - Token expired or invalid
        if (statusCode === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            toast.error('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/login';
          }
        }

        // Handle 403 Forbidden - User doesn't have permission
        if (statusCode === 403) {
          toast.error('Você não tem permissão para realizar esta ação.');
        }

        // Handle 404 Not Found
        if (statusCode === 404) {
          // Let the components handle this
        }

        // Handle 500 Server Error
        if (statusCode && statusCode >= 500) {
          toast.error('Erro no servidor. Tente novamente mais tarde.');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }

  // File upload helper
  public async uploadFile<T>(url: string, file: File, onProgress?: (percentage: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
  }
}

// Export a singleton instance
export const apiClient = ApiClient.getInstance();
