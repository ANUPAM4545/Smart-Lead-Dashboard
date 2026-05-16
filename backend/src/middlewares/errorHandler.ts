import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let customError = err;

  if (!(err instanceof CustomError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    customError = new CustomError(message, statusCode);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    customError = new CustomError(message, 400);
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    customError = new CustomError(message, 400);
  }

  // Handle Zod validation error
  if (err.name === 'ZodError') {
    const message = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    customError = new CustomError(message, 400);
  }

  res.status(customError.statusCode).json({
    status: 'error',
    message: customError.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
