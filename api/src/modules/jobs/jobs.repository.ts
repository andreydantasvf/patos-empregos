import { prisma } from '@shared/providers/prisma.provider';
import type { JobStatus, JobType, Prisma } from '@prisma/client';
import type { CreateJobDto, JobFilters } from './jobs.dto';
import type { PaginationParams } from '@shared/utils/pagination';

function buildWhereClause(
  filters: JobFilters & { status?: JobStatus },
): Prisma.JobWhereInput {
  const where: Prisma.JobWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.city) {
    where.city = { contains: filters.city, mode: 'insensitive' };
  }

  if (filters.type) {
    where.type = filters.type as JobType;
  }

  if (filters.company) {
    where.companyName = { contains: filters.company, mode: 'insensitive' };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { companyName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

export const jobsRepository = {
  async findAll(
    pagination: PaginationParams,
    filters: JobFilters & { status?: JobStatus },
  ) {
    const where = buildWhereClause(filters);

    const [jobs, total] = await prisma.$transaction([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.job.count({ where }),
    ]);

    return { jobs, total };
  },

  async findById(id: string) {
    return prisma.job.findUnique({ where: { id } });
  },

  async create(data: CreateJobDto) {
    return prisma.job.create({ data });
  },

  async updateStatus(id: string, status: JobStatus) {
    return prisma.job.update({ where: { id }, data: { status } });
  },

  async delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },
};
