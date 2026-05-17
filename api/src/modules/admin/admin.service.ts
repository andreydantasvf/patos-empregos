import type { JobDto, JobFilters } from '@modules/jobs/jobs.dto';
import { jobsRepository } from '@modules/jobs/jobs.repository';
import { NotFoundError } from '@shared/errors/HttpError';
import { logger } from '@shared/utils/logger';
import type { PaginationParams } from '@shared/utils/pagination';
import { buildMeta } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';

export const adminService = {
  async listAll(
    pagination: PaginationParams,
    filters: JobFilters,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      city: filters.city,
      type: filters.type,
      company: filters.company,
      search: filters.search,
    });

    return { jobs: jobs as JobDto[], meta: buildMeta(total, pagination.page, pagination.limit) };
  },

  async update(id: string, data: Partial<JobDto>): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    if (data.status === 'ACTIVE') {
      // Se for ativar a vaga, garantir que ela tenha data de expiração
      if (!job.expiresAt || job.expiresAt < new Date()) {
        const expiresAt = new Date();

        if (job.plan === 'BASIC') {
          expiresAt.setDate(expiresAt.getDate() + 7);
        } else if (job.plan === 'PRO') {
          expiresAt.setDate(expiresAt.getDate() + 15);
          data.expiresAt = expiresAt;
        }
      }
    }

    if (data.status === 'EXPIRED') {
      data.expiresAt = null;
    }

    const updatedJob = await jobsRepository.update(id, data);
    logger.info({ jobId: id, status: data.status }, '[Admin] Status da vaga atualizado');
    return updatedJob as JobDto;
  },

  async remove(id: string): Promise<void> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    await jobsRepository.delete(id);
    logger.info({ jobId: id }, '[Admin] Vaga removida');
  },
};
