import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { JWTPayload, User } from '@/types';
import { executeQuery } from '@/config/database';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
      userRole?: string;
    }
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    // Get user from database
    const users = await executeQuery<User[]>(
      'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
      return;
    }
    
    const user = users[0];
    
    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
      return;
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.',
      });
      return;
    }
    
    if (!roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }
    
    next();
  };
};

// Admin only middleware
export const adminOnly = authorize('Admin');

// Teacher or Admin middleware
export const teacherOrAdmin = authorize('Teacher', 'Admin');

// Parent or Admin middleware
export const parentOrAdmin = authorize('Parent', 'Admin');

// Student or Admin middleware
export const studentOrAdmin = authorize('Student', 'Admin');

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    
    const users = await executeQuery<User[]>(
      'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );
    
    if (users.length > 0) {
      req.user = users[0];
      req.userId = users[0].id;
      req.userRole = decoded.role;
    }
    
    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

// Check if user owns resource or is admin
export const ownerOrAdmin = (userIdField: string = 'user_id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.',
      });
      return;
    }
    
    if (req.userRole === 'Admin') {
      next();
      return;
    }
    
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (req.userId !== parseInt(resourceUserId)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.',
      });
      return;
    }
    
    next();
  };
};

// Rate limiting middleware (basic implementation)
export const rateLimit = (maxRequests: number = 100, windowMs: number = 900000) => {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requests.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }
    
    if (clientData.count >= maxRequests) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
      return;
    }
    
    clientData.count++;
    next();
  };
};
