
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AuthUser, authService, LoginCredentials, RegisterUserData } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterUserData) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
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
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        // Validate token with backend
        const profileData = await authService.getProfile();
        if (profileData) {
          setUser(profileData);
          setLoading(false);
          return true;
        }
      }
      
      // If we got here, auth failed
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
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const register = async (userData: RegisterUserData): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      setLoading(false);
      return !!result;
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
