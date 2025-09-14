import { Request, Response, NextFunction } from 'express';
import { ApiResponse, AppError } from '@/types';
import { config } from '@/config';

// Custom error class
export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle different types of errors
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' || error.name === 'MongooseError') {
    statusCode = 500;
    message = 'Database Error';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    if (error.message.includes('File too large')) {
      message = 'File size too large';
    } else if (error.message.includes('Unexpected field')) {
      message = 'Unexpected file field';
    } else {
      message = 'File upload error';
    }
  }

  // Log error details
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    statusCode,
    isOperational,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  };

  // Log error based on environment
  if (config.nodeEnv === 'development') {
    console.error('Error Details:', errorDetails);
  } else {
    // In production, log to file or external service
    console.error('Production Error:', {
      message: error.message,
      statusCode,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Send error response
  const response: ApiResponse = {
    success: false,
    message: config.nodeEnv === 'development' ? message : 'Something went wrong',
    error: config.nodeEnv === 'development' ? error.message : undefined,
  };

  res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`,
  };
  
  res.status(404).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error formatter
export const formatValidationErrors = (errors: any[]): string[] => {
  return errors.map(error => {
    if (error.type === 'field') {
      return `${error.path}: ${error.msg}`;
    }
    return error.msg;
  });
};

// Database error handler
export const handleDatabaseError = (error: any): CustomError => {
  if (error.code === 'ER_DUP_ENTRY') {
    return new CustomError('Duplicate entry. Record already exists.', 409);
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new CustomError('Referenced record not found.', 400);
  }
  
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new CustomError('Cannot delete record. It is referenced by other records.', 409);
  }
  
  if (error.code === 'ER_BAD_FIELD_ERROR') {
    return new CustomError('Invalid field name.', 400);
  }
  
  if (error.code === 'ER_PARSE_ERROR') {
    return new CustomError('Database query syntax error.', 500);
  }
  
  return new CustomError('Database operation failed.', 500);
};

// File upload error handler
export const handleFileUploadError = (error: any): CustomError => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new CustomError('File size too large.', 400);
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new CustomError('Too many files uploaded.', 400);
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new CustomError('Unexpected file field.', 400);
  }
  
  return new CustomError('File upload failed.', 500);
};

// Rate limit error handler
export const handleRateLimitError = (): CustomError => {
  return new CustomError('Too many requests. Please try again later.', 429);
};

// Permission error handler
export const handlePermissionError = (): CustomError => {
  return new CustomError('Insufficient permissions to perform this action.', 403);
};

// Authentication error handler
export const handleAuthError = (message: string = 'Authentication failed'): CustomError => {
  return new CustomError(message, 401);
};

// Not found error handler
export const handleNotFoundError = (resource: string = 'Resource'): CustomError => {
  return new CustomError(`${resource} not found.`, 404);
};

// Bad request error handler
export const handleBadRequestError = (message: string = 'Bad request'): CustomError => {
  return new CustomError(message, 400);
};

// Conflict error handler
export const handleConflictError = (message: string = 'Resource conflict'): CustomError => {
  return new CustomError(message, 409);
};

// Unprocessable entity error handler
export const handleUnprocessableEntityError = (message: string = 'Unprocessable entity'): CustomError => {
  return new CustomError(message, 422);
};
