import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { CustomError } from '../utils/CustomError';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new CustomError(`User role ${req.user?.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
