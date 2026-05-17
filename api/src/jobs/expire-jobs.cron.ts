import { prisma } from '@config/prisma';
import { logger } from '@shared/utils/logger';
import cron from 'node-cron';

export function scheduleExpireJobs(): void {
  // Roda diariamente à meia-noite no fuso America/Fortaleza
  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        const result = await prisma.job.updateMany({
          where: {
            status: { in: ['ATIVA', 'SUSPENSA'] },
            expires_at: { lt: new Date() },
          },
          data: { status: 'EXPIRADA' },
        });

        if (result.count > 0) {
          logger.info({ count: result.count }, '[Cron] expire-jobs: vagas expiradas');
        }
      } catch (err) {
        logger.error({ err }, '[Cron] expire-jobs: erro ao expirar vagas');
      }
    },
    { timezone: 'America/Fortaleza' },
  );

  logger.info('[Cron] expire-jobs agendado — diariamente às 00:00');
}
