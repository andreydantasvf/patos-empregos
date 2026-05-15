import { uploadToCloudinary } from '@config/cloudinary';
import { UnauthorizedError, ValidationError } from '@shared/errors/HttpError';
import { parsePagination } from '@shared/utils/pagination';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import type { CreateJobInput, CreateJobWithBannerInput, ListJobsQuery } from './jobs.schema';
import { jobsService } from './jobs.service';

export const jobsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const query = req.query as ListJobsQuery;
      const { jobs, meta } = await jobsService.listPublic(pagination, query);
      res.json(successResponse(jobs, 'Vagas listadas com sucesso', meta));
    } catch (err) {
      next(err);
    }
  },

  async listByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const pagination = parsePagination(req);
      const { jobs, meta } = await jobsService.listByUser(req.user.sub, pagination);
      res.json(successResponse(jobs, 'Vagas listadas com sucesso', meta));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await jobsService.getById(req.params.id);
      res.json(successResponse(job, 'Vaga encontrada'));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      if (!req.file) {
        throw new ValidationError('Banner da vaga é obrigatório', { banner: ['Banner da vaga é obrigatório'] });
      }

      const { secure_url: bannerUrl } = await uploadToCloudinary(req.file.buffer);
      const input: CreateJobWithBannerInput = { ...(req.body as CreateJobInput), bannerUrl };
      const { job, payment } = await jobsService.create(req.user.sub, input, req.user.email);
      res.status(201).json(successResponse({ job, payment }, 'Vaga cadastrada com sucesso. Aguardando pagamento do PIX.'));
    } catch (err) {
      next(err);
    }
  },

  async webhookPix(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a real scenario, validate the webhook signature here
      const { paymentId } = req.body;
      if (paymentId) {
        await jobsService.activateJob(paymentId);
      }
      res.status(200).send('OK');
    } catch (err) {
      next(err);
    }
  },
};
