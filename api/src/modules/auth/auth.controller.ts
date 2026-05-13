import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { successResponse } from '@shared/utils/response';
import type { LoginInput } from './auth.schema';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);
      res.status(200).json(successResponse(result, 'Login realizado com sucesso'));
    } catch (err) {
      next(err);
    }
  },
};
