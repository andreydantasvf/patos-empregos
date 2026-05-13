import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';
import { ValidationError } from '@shared/errors/HttpError';
import { logger } from '@shared/utils/logger';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError && err.isOperational) {
    logger.warn({ err, path: req.path, method: req.method }, `[AppError] ${err.message}`);
  } else {
    logger.error({ err, path: req.path, method: req.method }, `[UnhandledError] ${err.message}`);
  }

  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Prisma unique constraint violation
  if ((err as NodeJS.ErrnoException & { code?: string }).code === 'P2002') {
    res.status(409).json({ statusCode: 409, message: 'Registro duplicado' });
    return;
  }

  // Prisma record not found
  if ((err as NodeJS.ErrnoException & { code?: string }).code === 'P2025') {
    res.status(404).json({ statusCode: 404, message: 'Registro não encontrado' });
    return;
  }

  res.status(500).json({ statusCode: 500, message: 'Erro interno do servidor' });
}
