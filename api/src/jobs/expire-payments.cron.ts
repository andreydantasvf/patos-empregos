import { prisma } from '@config/prisma';
import { logger } from '@shared/utils/logger';
import cron from 'node-cron';

export function scheduleExpirePayments(): void {
  // Roda a cada 6 horas
  cron.schedule(
    '0 */6 * * *',
    async () => {
      try {
        const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000); // 72h atrás

        const expiredPayments = await prisma.payment.findMany({
          where: {
            status: 'PENDING',
            createdAt: { lt: cutoff },
          },
          select: { id: true, jobId: true },
        });

        if (expiredPayments.length === 0) return;

        const jobIds = expiredPayments.map((p) => p.jobId);

        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { id: { in: expiredPayments.map((p) => p.id) } },
            data: { status: 'EXPIRED' },
          }),
          prisma.job.updateMany({
            where: {
              id: { in: jobIds },
              status: 'AGUARDANDO_PAGAMENTO',
            },
            data: { status: 'EXPIRADA' },
          }),
        ]);

        logger.info(
          { count: expiredPayments.length },
          '[Cron] expire-payments: pagamentos e vagas expirados',
        );
      } catch (err) {
        logger.error({ err }, '[Cron] expire-payments: erro ao expirar pagamentos');
      }
    },
    { timezone: 'America/Fortaleza' },
  );

  logger.info('[Cron] expire-payments agendado — a cada 6 horas');
}
