import type { JwtPayload } from '@shared/providers/jwt.provider';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
