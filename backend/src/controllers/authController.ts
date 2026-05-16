import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomError } from '../utils/CustomError';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales User']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedBody = registerSchema.parse(req.body);

  const userExists = await User.findOne({ email: parsedBody.email });
  if (userExists) {
    return next(new CustomError('User already exists', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(parsedBody.password, salt);

  const user = await User.create({
    name: parsedBody.name,
    email: parsedBody.email,
    password: hashedPassword,
    role: parsedBody.role || 'Sales User',
  });

  const token = generateToken(user.id, user.role);

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedBody = loginSchema.parse(req.body);

  const user = await User.findOne({ email: parsedBody.email });

  if (!user || !(await bcrypt.compare(parsedBody.password, user.password as string))) {
    return next(new CustomError('Invalid credentials', 401));
  }

  const token = generateToken(user.id, user.role);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new CustomError('Google ID Token is required', 400));
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    return next(new CustomError('Invalid Google Token', 400));
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      role: 'Sales User',
    });
  } else if (!user.googleId) {
    // If user exists with email but no googleId, link them
    user.googleId = googleId;
    await user.save();
  }

  const token = generateToken(user.id, user.role);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getMe = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
