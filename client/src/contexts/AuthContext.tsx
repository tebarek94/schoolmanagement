import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { getRoleWelcomeMessage } from '../utils/authUtils';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
          // Verify token is still valid
          const isValid = await authService.verifyToken();
          if (isValid) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            // Token is invalid, clear storage
            await authService.logout();
          }
        } else {
          // Clear any invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setToken(response.token);
      setUser(response.user);
      
      // Debug: Log the user object to see its structure
      console.log('Login response user object:', response.user);
      
      // Show personalized welcome message with error handling
      try {
        const welcomeMessage = getRoleWelcomeMessage(response.user);
        toast.success(welcomeMessage);
      } catch (error) {
        console.error('Error generating welcome message:', error);
        toast.success('Login successful!');
      }
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



