import type { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { successResponse } from '@shared/utils/response';
import { parsePagination } from '@shared/utils/pagination';

export const adminController = {
  async listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const { status, city, type, company, search } = req.query as Record<string, string>;
      const { jobs, meta } = await adminService.listAll(pagination, {
        status,
        city,
        type: type as never,
        company,
        search,
      });
      res.json(successResponse(jobs, 'Vagas listadas', meta));
    } catch (err) {
      next(err);
    }
  },

  async approveJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await adminService.approve(req.params.id);
      res.json(successResponse(job, 'Vaga aprovada com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  async rejectJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await adminService.reject(req.params.id);
      res.json(successResponse(job, 'Vaga rejeitada com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.remove(req.params.id);
      res.json(successResponse(null, 'Vaga removida com sucesso'));
    } catch (err) {
      next(err);
    }
  },
};
