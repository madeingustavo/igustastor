
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AuthUser, authService, LoginCredentials } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    setLoading(true);
    try {
      // Try to get current user from local storage
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
        setLoading(false);
        return true;
      }
      
      setUser(null);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const userData = await authService.login(credentials);
      if (userData) {
        setUser(userData);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
