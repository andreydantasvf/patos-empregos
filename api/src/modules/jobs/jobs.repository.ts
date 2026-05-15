import { JobStatus, JobType, Prisma } from '@/generated/prisma/client';
import { prisma } from '@config/prisma';
import type { PaginationParams } from '@shared/utils/pagination';
import type { CreateJobDto, JobFilters } from './jobs.dto';

function buildWhereClause(filters: JobFilters): Prisma.JobWhereInput {
  const where: Prisma.JobWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
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

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

export const jobsRepository = {
  async findAll(pagination: PaginationParams, filters: JobFilters) {
    const where = buildWhereClause(filters);

    const [jobs, total] = await prisma.$transaction([
      prisma.job.findMany({
        where,
        orderBy: [
          { plan: 'desc' },
          { createdAt: 'desc' },
        ],
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

  async findByPaymentId(paymentId: string) {
    return prisma.job.findFirst({ where: { paymentId } });
  },

  async create(data: CreateJobDto & { paymentId?: string; status?: JobStatus }) {
    return prisma.job.create({
      data,
    });
  },

  async update(id: string, data: Prisma.JobUpdateInput) {
    return prisma.job.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },
};
