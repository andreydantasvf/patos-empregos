import { jobsRepository } from '@modules/jobs/jobs.repository';
import { NotFoundError } from '@shared/errors/HttpError';
import { logger } from '@shared/utils/logger';
import { buildMeta } from '@shared/utils/pagination';
import type { JobDto, JobFilters } from '@modules/jobs/jobs.dto';
import type { PaginationParams } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';

export const adminService = {
  async listAll(
    pagination: PaginationParams,
    filters: JobFilters & { status?: string },
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      city: filters.city,
      type: filters.type,
      company: filters.company,
      search: filters.search,
      status: filters.status as JobDto['status'] | undefined,
    });

    return { jobs: jobs as JobDto[], meta: buildMeta(total, pagination.page, pagination.limit) };
  },

  async approve(id: string): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    const updated = await jobsRepository.updateStatus(id, 'APPROVED');
    logger.info({ jobId: id }, '[Admin] Vaga aprovada');
    return updated as JobDto;
  },

  async reject(id: string): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    const updated = await jobsRepository.updateStatus(id, 'REJECTED');
    logger.info({ jobId: id }, '[Admin] Vaga rejeitada');
    return updated as JobDto;
  },

  async remove(id: string): Promise<void> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    await jobsRepository.delete(id);
    logger.info({ jobId: id }, '[Admin] Vaga removida');
  },
};
