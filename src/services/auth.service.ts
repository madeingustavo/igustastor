
import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  username?: string;
}

export class AuthService {
  public async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      return response.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
      return null;
    }
  }

  public async register(userData: RegisterUserData): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      toast.success('Usuário registrado com sucesso!');
      return response.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao registrar usuário.';
      toast.error(errorMessage);
      return null;
    }
  }

  public async getProfile(): Promise<AuthUser | null> {
    try {
      return await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.PROFILE);
    } catch (error) {
      return null;
    }
  }

  public async updateProfile(data: UpdateProfileData): Promise<AuthUser | null> {
    try {
      const response = await apiClient.put<AuthUser>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
      
      // Update stored user data
      const storedUser = this.getCurrentUser();
      if (storedUser) {
        const updatedUser = { ...storedUser, ...response };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      
      toast.success('Perfil atualizado com sucesso!');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao atualizar perfil.';
      toast.error(errorMessage);
      return null;
    }
  }

  public async changePassword(data: ChangePasswordData): Promise<boolean> {
    try {
      await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      toast.success('Senha alterada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Falha ao alterar senha.';
      toast.error(errorMessage);
      return false;
    }
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  public getCurrentUser(): AuthUser | null {
    const userString = localStorage.getItem('auth_user');
    if (userString) {
      try {
        return JSON.parse(userString) as AuthUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  public hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  
  public isAdmin(): boolean {
    return this.hasRole('admin');
  }
}

export const authService = new AuthService();
