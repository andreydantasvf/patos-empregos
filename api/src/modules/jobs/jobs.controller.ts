import type { Request, Response, NextFunction } from 'express';
import { jobsService } from './jobs.service';
import { successResponse } from '@shared/utils/response';
import { parsePagination } from '@shared/utils/pagination';
import type { CreateJobInput, CreateJobWithBannerInput, ListJobsQuery } from './jobs.schema';
import { uploadToCloudinary } from '@config/cloudinary';
import { ValidationError } from '@shared/errors/HttpError';

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
      if (!req.file) {
        throw new ValidationError('Banner da vaga é obrigatório', { banner: ['Banner da vaga é obrigatório'] });
      }

      const { secure_url: bannerUrl } = await uploadToCloudinary(req.file.buffer);
      const input: CreateJobWithBannerInput = { ...(req.body as CreateJobInput), bannerUrl };
      const job = await jobsService.create(input);
      res.status(201).json(successResponse(job, 'Vaga cadastrada com sucesso. Aguardando aprovação.'));
    } catch (err) {
      next(err);
    }
  },
};
