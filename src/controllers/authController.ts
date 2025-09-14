import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { LoginRequest, RegisterRequest, ApiResponse } from '@/types';
import { asyncHandler, CustomError } from '@/middlewares/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Login user
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginData: LoginRequest = req.body;
    
    const result = await this.authService.login(loginData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: result,
    };
    
    res.status(200).json(response);
  });

  // Register new user
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const registerData: RegisterRequest = req.body;
    
    const result = await this.authService.register(registerData);
    
    const response: ApiResponse = {
      success: true,
      message: 'Registration successful',
      data: result,
    };
    
    res.status(201).json(response);
  });

  // Refresh token
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new CustomError('Refresh token is required', 400);
    }
    
    const result = await this.authService.refreshToken(refreshToken);
    
    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    };
    
    res.status(200).json(response);
  });

  // Get current user profile
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    
    const result = await this.authService.getUserProfile(userId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: result,
    };
    
    res.status(200).json(response);
  });

  // Change password
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;
    
    await this.authService.changePassword(userId, currentPassword, newPassword);
    
    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully',
    };
    
    res.status(200).json(response);
  });

  // Logout
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    
    await this.authService.logout(userId);
    
    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
    };
    
    res.status(200).json(response);
  });

  // Verify token (for frontend to check if token is still valid)
  verifyToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // If we reach here, the token is valid (authenticate middleware passed)
    const response: ApiResponse = {
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: req.userId,
          email: req.user?.email,
          role: req.userRole,
        },
      },
    };
    
    res.status(200).json(response);
  });
}
