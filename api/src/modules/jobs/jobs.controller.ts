import { uploadToCloudinary } from '@/shared/providers/cloudinary.provider';
import { UnauthorizedError, ValidationError } from '@shared/errors/HttpError';
import { parsePagination } from '@shared/utils/pagination';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import type { CreateJobInput, CreateJobWithImageInput, ListJobsQuery } from './jobs.schema';
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

  async listByCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const pagination = parsePagination(req);
      const { jobs, meta } = await jobsService.listByCompany(req.user.sub, pagination);
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
        throw new ValidationError('Imagem da vaga é obrigatória', {
          image: ['Imagem da vaga é obrigatória'],
        });
      }

      const { secure_url: image_url } = await uploadToCloudinary(req.file.buffer);
      const input: CreateJobWithImageInput = { ...(req.body as CreateJobInput), image_url };
      const { job, payment } = await jobsService.create(req.user.sub, input);
      res.status(201).json(
        successResponse(
          { job, payment },
          'Vaga cadastrada com sucesso. Aguardando confirmação do pagamento PIX.',
        ),
      );
    } catch (err) {
      next(err);
    }
  },

  async renew(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await jobsService.renewJob(req.params.id, req.user.sub);
      res.json(successResponse(result, 'Renovação iniciada. Realize o pagamento PIX para reativar.'));
    } catch (err) {
      next(err);
    }
  },
};
