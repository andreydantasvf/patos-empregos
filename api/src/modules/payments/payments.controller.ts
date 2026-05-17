import { UnauthorizedError } from '@shared/errors/HttpError';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import { paymentsService } from './payments.service';

export const paymentsController = {
  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await paymentsService.getStatus(req.params.jobId, req.user.sub);
      res.json(successResponse(result, 'Status do pagamento obtido'));
    } catch (err) {
      next(err);
    }
  },

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['x-signature'] as string;
      const requestId = req.headers['x-request-id'] as string;
      const dataId = (req.query['data.id'] as string) || req.body?.data?.id || req.body?.id;

      await paymentsService.processWebhook({ signature, requestId, dataId }, dataId);

      res.status(200).send('OK');
    } catch (err) {
      next(err);
    }
  },
};
