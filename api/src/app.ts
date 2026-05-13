import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { apiReference } from '@scalar/express-api-reference';

import { env } from '@config/env';
import { openApiSpec } from '@config/openapi';
import { errorMiddleware } from '@shared/middlewares/error.middleware';
import { logger } from '@shared/utils/logger';
import { successResponse } from '@shared/utils/response';

import authRoutes from '@modules/auth/auth.routes';
import jobsRoutes from '@modules/jobs/jobs.routes';
import adminRoutes from '@modules/admin/admin.routes';

const app = express();

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
    message: { statusCode: 429, message: 'Muitas tentativas de login. Tente novamente mais tarde.' },
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

// ─── API Documentation ────────────────────────────────────────────────────────
app.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

app.use(
  '/docs',
  apiReference({
    spec: { content: openApiSpec },
    theme: 'purple',
  }),
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/jobs', jobsRoutes);
app.use('/admin', adminRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ statusCode: 404, message: 'Rota não encontrada' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

logger.debug('Express app configurado com sucesso');

export default app;
