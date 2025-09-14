import { apiService } from './api';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<any>('/auth/login', credentials);
    
    // Extract the actual data from the ApiResponse wrapper
    const loginData: LoginResponse = response.data || response;
    
    // Store tokens and user data
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    
    return loginData;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiService.post<any>('/auth/register', userData);
    
    // Extract the actual data from the ApiResponse wrapper
    const loginData: LoginResponse = response.data || response;
    
    // Store tokens and user data
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    
    return loginData;
  }

  // Refresh token
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiService.post<any>('/auth/refresh-token', {
      refreshToken,
    });
    
    // Extract the actual data from the ApiResponse wrapper
    const loginData: LoginResponse = response.data || response;
    
    // Update stored tokens
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    
    return loginData;
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiService.get<any>('/auth/profile');
    // Extract the actual data from the ApiResponse wrapper
    return response.data || response;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Verify token
  async verifyToken(): Promise<boolean> {
    try {
      await apiService.get('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  // Get stored token
  getStoredToken(): string | null {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.getStoredUser();
    return user ? roles.includes(user.role) : false;
  }
}

export const authService = new AuthService();

