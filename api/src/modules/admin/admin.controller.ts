import { parsePagination } from '@shared/utils/pagination';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import { UpdateStatusDto } from './admin.schema';
import { adminService } from './admin.service';

export const adminController = {
  async listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const { city, type, company, search } = req.query as Record<string, string>;
      const { jobs, meta } = await adminService.listAll(pagination, {
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

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body as UpdateStatusDto;
      const updatedJob = await adminService.update(req.params.id, { status });
      res.json(successResponse(updatedJob, 'Status da vaga atualizado'));
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
