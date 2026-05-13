import { jobsRepository } from './jobs.repository';
import { NotFoundError } from '@shared/errors/HttpError';
import { logger } from '@shared/utils/logger';
import { buildMeta } from '@shared/utils/pagination';
import type { CreateJobInput, ListJobsQuery } from './jobs.schema';
import type { JobDto } from './jobs.dto';
import type { PaginationParams } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';

export const jobsService = {
  async listPublic(
    pagination: PaginationParams,
    query: ListJobsQuery,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      status: 'APPROVED',
      city: query.city,
      type: query.type,
      company: query.company,
      search: query.search,
    });

    return { jobs: jobs as JobDto[], meta: buildMeta(total, pagination.page, pagination.limit) };
  },

  async getById(id: string): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');
    if (job.status !== 'APPROVED') throw new NotFoundError('Vaga');
    return job as JobDto;
  },

  async create(input: CreateJobInput): Promise<JobDto> {
    const job = await jobsRepository.create({
      ...input,
      salary: input.salary ?? null,
      benefits: input.benefits ?? null,
      applicationLink: input.applicationLink || null,
    });

    logger.info(
      { jobId: job.id, company: job.companyName, title: job.title },
      '[Jobs] Nova vaga cadastrada — aguardando aprovação',
    );

    return job as JobDto;
  },
};
