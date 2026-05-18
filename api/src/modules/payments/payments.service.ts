import { prisma } from '@config/prisma';
import { AppError } from '@shared/errors/AppError';
import { whatsappProvider } from '@shared/providers/whatsapp.provider';
import { paymentProvider, WebhookValidationParams } from '@shared/providers/payment.provider';
import { logger } from '@shared/utils/logger';
import { jobsRepository } from '@modules/jobs/jobs.repository';
import { jobsService } from '@modules/jobs/jobs.service';
import { env } from '@config/env';
import { newJobTemplate } from '@shared/utils/message-template';

export const paymentsService = {
  async getStatus(jobId: string, companyId: string) {
    const payment = await prisma.payment.findFirst({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      return { status: 'PENDING', confirmedAt: null };
    }

    if (payment.companyId !== companyId) {
      throw new AppError('Acesso negado', 403);
    }

    return {
      status: payment.status,
      confirmedAt: payment.confirmed_at,
      plan: payment.plan,
      amount: payment.amount,
    };
  },

  async processWebhook(params: WebhookValidationParams, dataId: string): Promise<void> {
    const isValid = paymentProvider.validateWebhook(params);
    if (!isValid) {
      throw new AppError('Assinatura do webhook inválida', 401);
    }

    let orderDetails;
    try {
      orderDetails = await paymentProvider.getPaymentDetails(dataId);
    } catch {
      logger.warn({ dataId }, '[Payments] Não foi possível obter detalhes do pedido');
      return;
    }

    const isConfirmed =
      (orderDetails.status === 'processed' && orderDetails.payment_status_detail === 'accredited') ||
      orderDetails.status_detail === 'accredited';

    if (!isConfirmed) {
      logger.info(
        { dataId, status: orderDetails.status, detail: orderDetails.payment_status_detail },
        '[Payments] Webhook recebido — pagamento ainda não confirmado',
      );
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: { mp_preference_id: dataId },
    });

    if (!payment) {
      logger.warn({ dataId }, '[Payments] Nenhum pagamento encontrado para o preference_id');
      return;
    }

    if (payment.status === 'CONFIRMED') {
      return;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'CONFIRMED',
        mp_payment_id: dataId,
        confirmed_at: new Date(),
      },
    });

    await jobsService.activateJob(payment.jobId);

    if (env.WHATSAPP_GROUP_ID) {
      const job = await jobsRepository.findById(payment.jobId);
      if (job) {
        try {
          const message = newJobTemplate(job as never, job.company as never);
          await whatsappProvider.sendGroupMessage({
            groupId: env.WHATSAPP_GROUP_ID,
            message,
            imageUrl: job.image_url,
          });
        } catch (err) {
          logger.error({ err, jobId: payment.jobId }, '[Payments] Falha ao enviar WhatsApp');
        }
      }
    }

    logger.info({ paymentId: payment.id, jobId: payment.jobId }, '[Payments] Pagamento confirmado');
  },
};
