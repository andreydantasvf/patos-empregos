import { JobStatus, JobType, Prisma } from '@/generated/prisma/client';
import { prisma } from '@config/prisma';
import type { PaginationParams } from '@shared/utils/pagination';
import type { CreateJobDto, JobFilters } from './jobs.dto';

const companySelect = {
  id: true,
  name: true,
  logo_url: true,
} satisfies Prisma.CompanySelect;

function buildWhereClause(filters: JobFilters): Prisma.JobWhereInput {
  const where: Prisma.JobWhereInput = {};

  if (filters.companyId) {
    where.companyId = filters.companyId;
  }

  if (filters.area) {
    where.area = { contains: filters.area, mode: 'insensitive' };
  }

  if (filters.type) {
    where.type = filters.type as JobType;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { area: { contains: filters.search, mode: 'insensitive' } },
      { company: { name: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  if (filters.status === JobStatus.ATIVA) {
    where.AND = [
      { status: JobStatus.ATIVA },
      { OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }] },
    ];
  } else if (filters.status) {
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
        include: { company: { select: companySelect } },
        orderBy: [
          { is_featured: 'desc' },
          { published_at: 'desc' },
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
    return prisma.job.findUnique({
      where: { id },
      include: { company: { select: companySelect } },
    });
  },

  async create(data: CreateJobDto) {
    return prisma.job.create({
      data,
      include: { company: { select: companySelect } },
    });
  },

  async update(id: string, data: Prisma.JobUpdateInput) {
    return prisma.job.update({
      where: { id },
      data,
      include: { company: { select: companySelect } },
    });
  },

  async delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },

  async findFeaturedForRepost(cutoffDate: Date) {
    return prisma.job.findMany({
      where: {
        plan: 'FEATURED',
        status: JobStatus.ATIVA,
        OR: [
          { whatsapp_sent_at: null },
          { whatsapp_sent_at: { lte: cutoffDate } },
        ],
      },
      include: { company: { select: companySelect } },
    });
  },

  async updateWhatsappSentAt(id: string) {
    return prisma.job.update({
      where: { id },
      data: { whatsapp_sent_at: new Date() },
    });
  },
};
