import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Basic Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
