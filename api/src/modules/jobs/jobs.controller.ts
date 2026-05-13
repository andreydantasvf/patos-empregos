import type { Request, Response, NextFunction } from 'express';
import { jobsService } from './jobs.service';
import { successResponse } from '@shared/utils/response';
import { parsePagination } from '@shared/utils/pagination';
import type { CreateJobInput, ListJobsQuery } from './jobs.schema';

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
      const input = req.body as CreateJobInput;
      const job = await jobsService.create(input);
      res.status(201).json(successResponse(job, 'Vaga cadastrada com sucesso. Aguardando aprovação.'));
    } catch (err) {
      next(err);
    }
  },
};
