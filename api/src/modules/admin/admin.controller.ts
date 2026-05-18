import { uploadToCloudinary } from '@/shared/providers/cloudinary.provider';
import { ValidationError } from '@shared/errors/HttpError';
import { parsePagination } from '@shared/utils/pagination';
import { successResponse } from '@shared/utils/response';
import type { NextFunction, Request, Response } from 'express';
import type { CreateFreeJobInput, CreateFreeJobWithImageInput, UpdateJobStatusDto } from './admin.schema';
import { adminService } from './admin.service';

export const adminController = {
  // ─── Jobs ─────────────────────────────────────────────────────────────────

  async createFreeJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateFreeJobInput;

      if (!req.file) {
        throw new ValidationError('Imagem da vaga é obrigatória', {
          image: ['Imagem da vaga é obrigatória'],
        });
      }

      const { secure_url: image_url } = await uploadToCloudinary(req.file.buffer);
      const jobInput: CreateFreeJobWithImageInput = { ...input, image_url };
      const job = await adminService.createFreeJob(jobInput);
      res.status(201).json(successResponse(job, 'Vaga gratuita criada e publicada com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  async listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req);
      const { area, type, companyId, search, status } = req.query as Record<string, string>;
      const { jobs, meta } = await adminService.listJobs(pagination, {
        area: area as never,
        type: type as never,
        companyId,
        search,
        status: status as never,
      });
      res.json(successResponse(jobs, 'Vagas listadas', meta));
    } catch (err) {
      next(err);
    }
  },

  async updateJobStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as UpdateJobStatusDto;
      const updatedJob = await adminService.updateJobStatus(req.params.id, dto);
      res.json(successResponse(updatedJob, 'Status da vaga atualizado'));
    } catch (err) {
      next(err);
    }
  },

  async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.removeJob(req.params.id);
      res.json(successResponse(null, 'Vaga removida com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  async repostJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await adminService.repostJob(req.params.id);
      res.json(successResponse(null, 'Vaga repostada no WhatsApp com sucesso'));
    } catch (err) {
      next(err);
    }
  },

  // ─── Empresas ─────────────────────────────────────────────────────────────

  async listCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await adminService.listCompanies();
      res.json(successResponse(companies, 'Empresas listadas'));
    } catch (err) {
      next(err);
    }
  },

  async getCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await adminService.getCompany(req.params.id);
      res.json(successResponse(company, 'Empresa encontrada'));
    } catch (err) {
      next(err);
    }
  },

  async toggleBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { blocked } = req.body as { blocked: boolean };
      await adminService.toggleBlock(req.params.id, blocked);
      const msg = blocked ? 'Empresa bloqueada com sucesso' : 'Empresa desbloqueada com sucesso';
      res.json(successResponse(null, msg));
    } catch (err) {
      next(err);
    }
  },

  // ─── Configurações ─────────────────────────────────────────────────────────

  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await adminService.getSettings();
      res.json(successResponse(settings, 'Configurações obtidas'));
    } catch (err) {
      next(err);
    }
  },
};
