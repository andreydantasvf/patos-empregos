import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { env } from '@config/env';
import { errorMiddleware } from '@shared/middlewares/error.middleware';
import { logger } from '@shared/utils/logger';
import { successResponse } from '@shared/utils/response';

import adminRoutes from '@modules/admin/admin.routes';
import authRoutes from '@modules/auth/auth.routes';
import empresaRoutes from '@modules/empresa/empresa.routes';
import jobsRoutes from '@modules/jobs/jobs.routes';
import paymentsRoutes from '@modules/payments/payments.routes';

import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ─── General rate limit ───────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { statusCode: 429, message: 'Muitas requisições. Tente novamente em alguns minutos.' },
  }),
);

// ─── Stricter rate limit on login ─────────────────────────────────────────────
app.use(
  '/auth/login',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      statusCode: 429,
      message: 'Muitas tentativas de login. Tente novamente mais tarde.',
    },
  }),
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json(
    successResponse(
      { status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV },
      'API online',
    ),
  );
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/jobs', jobsRoutes);
app.use('/payments', paymentsRoutes);
app.use('/admin', adminRoutes);
app.use('/empresa', empresaRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ statusCode: 404, message: 'Rota não encontrada' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

logger.debug('Express app configurado com sucesso');

export default app;
