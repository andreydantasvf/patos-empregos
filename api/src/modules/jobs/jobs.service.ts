import { JobPlan, JobStatus } from '@/generated/prisma/client';
import { companiesRepository } from '@modules/companies/companies.repository';
import { ForbiddenError, NotFoundError } from '@shared/errors/HttpError';
import { paymentProvider } from '@shared/providers/payment.provider';
import { logger } from '@shared/utils/logger';
import type { PaginationParams } from '@shared/utils/pagination';
import { buildMeta } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';
import { prisma } from '@config/prisma';
import type { JobDto } from './jobs.dto';
import { jobsRepository } from './jobs.repository';
import type { CreateJobWithImageInput, ListJobsQuery } from './jobs.schema';

const PLAN_PRICES: Record<string, number> = {
  BASIC: 1.00,
  FEATURED: 79.00,
};

const PLAN_DAYS: Record<string, number> = {
  BASIC: 7,
  FEATURED: 15,
};

export const jobsService = {
  async listPublic(
    pagination: PaginationParams,
    query: ListJobsQuery,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      area: query.area as never,
      type: query.type as never,
      search: query.search,
      status: JobStatus.ATIVA,
    });

    return {
      jobs: jobs as unknown as JobDto[],
      meta: buildMeta(total, pagination.page, pagination.limit),
    };
  },

  async listByCompany(
    companyId: string,
    pagination: PaginationParams,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, { companyId });

    return {
      jobs: jobs as unknown as JobDto[],
      meta: buildMeta(total, pagination.page, pagination.limit),
    };
  },

  async getById(id: string): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job || job.status !== JobStatus.ATIVA) throw new NotFoundError('Vaga');
    return job as unknown as JobDto;
  },

  async create(
    companyId: string,
    input: CreateJobWithImageInput,
  ): Promise<{ job: JobDto; payment: { preferenceId: string; qrCode: string; qrCodeBase64: string; ticketUrl: string; amount: number } }> {
    const company = await companiesRepository.findById(companyId);
    if (!company) throw new NotFoundError('Empresa');

    const amount = PLAN_PRICES[input.plan] ?? PLAN_PRICES.BASIC;

    const pixPayment = await paymentProvider.generatePixPayment({
      transaction_amount: amount,
      description: `Patos Empregos – ${input.title} – Plano ${input.plan === 'FEATURED' ? 'Destaque' : 'Básico'}`,
      payer: {
        name: company.name,
        email: company.email,
        identification: { type: 'CPF', number: company.cnpj_cpf ?? '00000000000' },
      },
    });

    const job = await jobsRepository.create({
      companyId,
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

    await prisma.payment.create({
      data: {
        jobId: job.id,
        companyId,
        plan: input.plan as JobPlan,
        amount,
        status: 'PENDING',
        mp_preference_id: pixPayment.preferenceId,
      },
    });

    logger.info(
      { jobId: job.id, companyId, plan: job.plan },
      '[Jobs] Vaga criada — aguardando pagamento',
    );

    return {
      job: job as unknown as JobDto,
      payment: {
        preferenceId: pixPayment.preferenceId,
        qrCode: pixPayment.qrCode,
        qrCodeBase64: pixPayment.qrCodeBase64,
        ticketUrl: pixPayment.ticketUrl,
        amount,
      },
    };
  },

  async activateJob(jobId: string): Promise<void> {
    const job = await jobsRepository.findById(jobId);
    if (!job) {
      logger.warn({ jobId }, '[Jobs] activateJob chamado para job desconhecido');
      return;
    }

    if (job.status === JobStatus.ATIVA) return;

    const days = PLAN_DAYS[job.plan] ?? PLAN_DAYS.BASIC;
    const publishedAt = new Date();
    const expiresAt = new Date(publishedAt);
    expiresAt.setDate(expiresAt.getDate() + days);

    await jobsRepository.update(job.id, {
      status: JobStatus.ATIVA,
      is_featured: job.plan === JobPlan.FEATURED,
      published_at: publishedAt,
      expires_at: expiresAt,
      whatsapp_sent_at: new Date(),
    });

    logger.info({ jobId: job.id, plan: job.plan }, '[Jobs] Vaga ativada com sucesso');
  },

  async renewJob(
    jobId: string,
    companyId: string,
  ): Promise<{ payment: { preferenceId: string; qrCode: string; qrCodeBase64: string; ticketUrl: string; amount: number } }> {
    const job = await jobsRepository.findById(jobId);
    if (!job) throw new NotFoundError('Vaga');
    if (job.companyId !== companyId) throw new ForbiddenError();
    if (job.status !== JobStatus.EXPIRADA) {
      throw new ForbiddenError();
    }

    const company = await companiesRepository.findById(companyId);
    if (!company) throw new NotFoundError('Empresa');

    const amount = PLAN_PRICES[job.plan] ?? PLAN_PRICES.BASIC;

    const pixPayment = await paymentProvider.generatePixPayment({
      transaction_amount: amount,
      description: `Patos Empregos – ${job.title} – Renovação Plano ${job.plan === 'FEATURED' ? 'Destaque' : 'Básico'}`,
      payer: {
        name: company.name,
        email: company.email,
        identification: { type: 'CPF', number: company.cnpj_cpf ?? '00000000000' },
      },
    });

    await prisma.payment.create({
      data: {
        jobId: job.id,
        companyId,
        plan: job.plan,
        amount,
        status: 'PENDING',
        mp_preference_id: pixPayment.preferenceId,
      },
    });

    await jobsRepository.update(job.id, { status: JobStatus.AGUARDANDO_PAGAMENTO });

    logger.info({ jobId: job.id }, '[Jobs] Renovação iniciada — aguardando pagamento');

    return {
      payment: {
        preferenceId: pixPayment.preferenceId,
        qrCode: pixPayment.qrCode,
        qrCodeBase64: pixPayment.qrCodeBase64,
        ticketUrl: pixPayment.ticketUrl,
        amount,
      },
    };
  },
};
