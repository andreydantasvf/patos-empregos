import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import type { AdminLoginInput, LoginInput, RegisterInput } from './auth.schema';
import { authService } from './auth.service';

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

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as RegisterInput;
      const result = await authService.register(input);
      res.status(201).json(successResponse(result, 'Conta criada com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as AdminLoginInput;
      const result = await authService.adminLogin(input);
      res.status(200).json(successResponse(result, 'Login realizado com sucesso'));
    } catch (err) {
      next(err);
    }
  },
};
