import type { Request, Response, NextFunction } from 'express';
import { jwtProvider } from '@shared/providers/jwt.provider';
import { UnauthorizedError } from '@shared/errors/HttpError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Token de autenticação não fornecido'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwtProvider.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}
