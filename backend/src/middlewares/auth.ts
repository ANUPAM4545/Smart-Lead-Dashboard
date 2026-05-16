import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomError } from '../utils/CustomError';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new CustomError('Not authorized to access this route', 401));
  }

  try {
    const decoded: any = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new CustomError('Not authorized to access this route', 401));
  }
};
