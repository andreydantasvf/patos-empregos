import { JobPlan, JobStatus } from '@/generated/prisma/client';
import { NotFoundError } from '@shared/errors/HttpError';
import { paymentProvider } from '@shared/providers/payment.provider';
import { logger } from '@shared/utils/logger';
import type { PaginationParams } from '@shared/utils/pagination';
import { buildMeta } from '@shared/utils/pagination';
import type { PaginationMeta } from '@shared/utils/response';
import type { JobDto } from './jobs.dto';
import { jobsRepository } from './jobs.repository';
import type { CreateJobWithBannerInput, ListJobsQuery } from './jobs.schema';

const PLAN_PRICES = {
  BASIC: 20,
  PRO: 35,
  PREMIUM: 0, // Disabled
};

const PLAN_DAYS = {
  BASIC: 7,
  PRO: 15,
  PREMIUM: 0,
};

export const jobsService = {
  async listPublic(
    pagination: PaginationParams,
    query: ListJobsQuery
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      city: query.city,
      type: query.type,
      company: query.company,
      search: query.search,
      status: JobStatus.ACTIVE,
    });

    // TODO: Filter expired jobs if not handled by a cronjob, or update their status here.
    const activeJobs = jobs.filter(job => !job.expiresAt || job.expiresAt > new Date());

    return { jobs: activeJobs as JobDto[], meta: buildMeta(activeJobs.length, pagination.page, pagination.limit) };
  },

  async listByUser(
    userId: string,
    pagination: PaginationParams,
  ): Promise<{ jobs: JobDto[]; meta: PaginationMeta }> {
    const { jobs, total } = await jobsRepository.findAll(pagination, {
      userId,
    });

    return { jobs: jobs as JobDto[], meta: buildMeta(total, pagination.page, pagination.limit) };
  },

  async getById(id: string): Promise<JobDto> {
    const job = await jobsRepository.findById(id);
    if (!job) throw new NotFoundError('Vaga');
    if (job.status !== JobStatus.ACTIVE) throw new NotFoundError('Vaga');
    if (job.expiresAt && job.expiresAt < new Date()) throw new NotFoundError('Vaga expirada');
    return job as JobDto;
  },

  async create(userId: string, input: CreateJobWithBannerInput, userEmail: string): Promise<{ job: JobDto; payment: any }> {
    const amount = PLAN_PRICES[input.plan as keyof typeof PLAN_PRICES] || 20;
    
    // Generate Pix
    const payment = await paymentProvider.generatePixPayment(amount, `Pagamento de vaga - ${input.plan}`);

    const job = await jobsRepository.create({
      ...input,
      userId,
      email: userEmail,
      salary: input.salary ?? null,
      benefits: input.benefits ?? null,
      applicationLink: input.applicationLink || null,
      plan: input.plan as JobPlan,
      amountPaid: amount.toString(),
      paymentId: payment.paymentId,
      status: JobStatus.PENDING,
    });

    logger.info(
      { jobId: job.id, company: job.companyName, plan: job.plan },
      '[Jobs] Nova vaga cadastrada — aguardando pagamento',
    );

    return { job: job as JobDto, payment };
  },

  async activateJob(paymentId: string): Promise<void> {
    const job = await jobsRepository.findByPaymentId(paymentId);
    if (!job) {
      logger.warn({ paymentId }, '[Jobs] Webhook recebido para paymentId desconhecido');
      return;
    }

    if (job.status === JobStatus.ACTIVE) {
      return; // Already active
    }

    const days = PLAN_DAYS[job.plan as keyof typeof PLAN_DAYS] || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await jobsRepository.update(job.id, {
      status: JobStatus.ACTIVE,
      paidAt: new Date(),
      expiresAt,
    });

    logger.info({ jobId: job.id }, '[Jobs] Vaga ativada com sucesso pelo webhook');
  }
};
