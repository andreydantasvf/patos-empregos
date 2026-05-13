import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@shared/errors/HttpError';

export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    next(new ForbiddenError('Acesso restrito a administradores'));
    return;
  }
  next();
}
