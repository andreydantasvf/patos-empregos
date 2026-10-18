import { UnauthorizedError } from '@shared/errors/HttpError';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import { empresaService, UpdateProfileInput } from './empresa.service';

export const empresaController = {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const profile = await empresaService.getProfile(req.user.sub);
      res.json(successResponse(profile, 'Perfil obtido'));
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const { name, phone, cnpj_cpf, logo_url } = req.body as UpdateProfileInput;
      const updated = await empresaService.updateProfile(req.user.sub, {
        name,
        phone,
        cnpj_cpf,
        logo_url,
      });
      res.json(successResponse(updated, 'Perfil atualizado'));
    } catch (err) {
      next(err);
    }
  },
};
