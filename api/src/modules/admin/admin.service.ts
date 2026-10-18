import { env } from '@config/env';
import { prisma } from '@config/prisma';
import { companiesRepository } from '@modules/companies/companies.repository';
import { JobPlan, JobStatus } from '@/generated/prisma/client';
import type { JobDto, JobFilters } from '@modules/jobs/jobs.dto';
import { jobsRepository } from '@modules/jobs/jobs.repository';
import { ForbiddenError, NotFoundError } from '@shared/errors/HttpError';
import { whatsappProvider } from '@shared/providers/whatsapp.provider';
import { newJobTemplate, repostTemplate } from '@shared/utils/message-template';
import { logger } from '@shared/utils/logger';
import type { PaginationParams } from '@shared/utils/pagination';
import { buildMeta } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';
import type { CreateFreeJobWithImageInput, UpdateJobStatusDto } from './admin.schema';

export const adminService = {
  async createFreeJob(input: CreateFreeJobWithImageInput): Promise<JobDto> {
    const company = await companiesRepository.findById(input.companyId);
    if (!company) throw new NotFoundError('Empresa');

    const publishedAt = new Date();
    const days = input.plan === 'FEATURED' ? 15 : 7;
    const expiresAt = new Date(publishedAt);
    expiresAt.setDate(expiresAt.getDate() + days);

    const job = await jobsRepository.create({
      companyId: input.companyId,
      title: input.title,
      description: input.description,
      area: input.area as never,
      type: input.type as never,
      salary: input.salary ?? null,
      image_url: input.image_url,
      application_link: input.application_link,
      plan: input.plan as JobPlan,
      requirements: input.requirements ?? null,
      benefits: input.benefits ?? null,
    });

    await jobsRepository.update(job.id, {
      status: JobStatus.ATIVA,
      is_featured: input.plan === 'FEATURED',
      published_at: publishedAt,
      expires_at: expiresAt,
      whatsapp_sent_at: new Date(),
    });

    if (env.WHATSAPP_GROUP_ID) {
      try {
        const message = newJobTemplate(job as never, job.company as never);
        await whatsappProvider.sendGroupMessage({
          groupId: env.WHATSAPP_GROUP_ID,
          message,
          imageUrl: job.image_url,
        });
      } catch (err) {
        logger.error({ err, jobId: job.id }, '[Admin] Falha ao enviar WhatsApp para vaga gratuita');
      }
    }

    logger.info({ jobId: job.id, companyId: input.companyId, plan: input.plan }, '[Admin] Vaga gratuita criada e ativada');

    return { ...job, status: JobStatus.ATIVA, is_featured: input.plan === 'FEATURED', published_at: publishedAt, expires_at: expiresAt } as unknown as JobDto;
  },

  async listJobs(
    pagination: PaginationParams,
    filters: JobFilters,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      area: filters.area,
      type: filters.type,
      search: filters.search,
      status: filters.status,
      companyId: filters.companyId,
    });

    return {
      jobs: jobs as unknown as JobDto[],
      meta: buildMeta(total, pagination.page, pagination.limit),
    };
  },

  async updateJobStatus(id: string, dto: UpdateJobStatusDto): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    const updateData: Record<string, unknown> = { status: dto.status };

    if (dto.status === 'SUSPENSA') {
      updateData.suspension_reason = dto.motivo;
    } else if (dto.status === 'ATIVA') {
      updateData.suspension_reason = null;
      if (!job.published_at) {
        const publishedAt = new Date();
        const days = job.plan === 'FEATURED' ? 15 : 7;
        const expiresAt = new Date(publishedAt);
        expiresAt.setDate(expiresAt.getDate() + days);
        updateData.published_at = publishedAt;
        updateData.expires_at = expiresAt;
        updateData.is_featured = job.plan === 'FEATURED';
      }
    }

    const updatedJob = await jobsRepository.update(id, updateData);

    logger.info({ jobId: id, status: dto.status }, '[Admin] Status da vaga atualizado');

    return updatedJob as unknown as JobDto;
  },

  async removeJob(id: string): Promise<void> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { jobId: id } }),
      prisma.job.delete({ where: { id } }),
    ]);
    logger.info({ jobId: id }, '[Admin] Vaga removida');
  },

  async repostJob(id: string): Promise<void> {
    if (!env.WHATSAPP_GROUP_ID) {
      throw new ForbiddenError();
    }

    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');
    if (job.status !== JobStatus.ATIVA) {
      throw new ForbiddenError();
    }

    const message = repostTemplate(job as never, job.company as never);
    await whatsappProvider.sendGroupMessage({
      groupId: env.WHATSAPP_GROUP_ID,
      message,
      imageUrl: job.image_url,
    });

    await jobsRepository.updateWhatsappSentAt(id);
    logger.info({ jobId: id }, '[Admin] Repost manual enviado ao WhatsApp');
  },

  // ─── Gestão de Empresas ────────────────────────────────────────────────────

  async listCompanies() {
    return companiesRepository.findAll();
  },

  async getCompany(id: string) {
    const company = await companiesRepository.findById(id);
    if (!company) throw new NotFoundError('Empresa');
    const { password: _pw, ...rest } = company;
    void _pw;
    return rest;
  },

  async toggleBlock(id: string, blocked: boolean) {
    const company = await companiesRepository.findById(id);
    if (!company) throw new NotFoundError('Empresa');

    await companiesRepository.toggleBlock(id, blocked);
    logger.info({ companyId: id, blocked }, '[Admin] Empresa bloqueada/desbloqueada');
  },

  // ─── Configurações ─────────────────────────────────────────────────────────

  async getSettings() {
    return {
      whatsappGroupId: env.WHATSAPP_GROUP_ID ?? null,
      appUrl: env.APP_URL,
    };
  },
};
