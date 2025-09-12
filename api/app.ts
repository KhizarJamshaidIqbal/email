/**
 * This is a API server
 */

// Environment variables are loaded in server.ts

import express, { type Request, type Response, type NextFunction }  from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import emailRoutes from './routes/email.js';

// for esm mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app: express.Application = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email', emailRoutes);

/**
 * health
 */
app.use('/api/health', (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).json({
    success: true,
    message: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      ai: 'Multi-model AI service (OpenRouter + Gemini)',
      email: 'Email distribution (SendGrid + Mailchimp)',
      database: 'Supabase PostgreSQL'
    }
  });
});

/**
 * API documentation endpoint
 */
app.use('/api', (req: Request, res: Response, next: NextFunction): void => {
  res.status(200).json({
    name: 'Newsletter Creator API',
    version: '1.0.0',
    description: 'Comprehensive API for newsletter creation with AI assistance and email distribution',
    endpoints: {
      auth: '/api/auth - Authentication and user management',
      ai: '/api/ai - AI-powered content generation and optimization',
      email: '/api/email - Email distribution and analytics'
    },
    features: {
      multiModelAI: 'Intelligent routing between OpenRouter and Gemini models',
      imageGeneration: 'Gemini Imagen for custom newsletter images',
      emailDistribution: 'SendGrid and Mailchimp integration',
      analytics: 'Comprehensive email performance tracking'
    }
  });
});

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error'
  });
});

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found'
  });
});

export default app;