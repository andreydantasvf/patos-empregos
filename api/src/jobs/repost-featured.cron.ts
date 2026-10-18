import { env } from '@config/env';
import { jobsRepository } from '@modules/jobs/jobs.repository';
import { whatsappProvider } from '@shared/providers/whatsapp.provider';
import { repostTemplate } from '@shared/utils/message-template';
import { logger } from '@shared/utils/logger';
import cron from 'node-cron';

export function scheduleRepostFeatured(): void {
  // Roda diariamente às 09:00 no fuso America/Fortaleza
  cron.schedule(
    '0 9 * * *',
    async () => {
      if (!env.WHATSAPP_GROUP_ID) return;

      try {
        // 2d 23h — 1h de folga para evitar miss por timing do cron vs. hora de envio
        const cutoff = new Date(Date.now() - (3 * 24 - 1) * 60 * 60 * 1000);
        const jobs = await jobsRepository.findFeaturedForRepost(cutoff);

        if (jobs.length === 0) return;

        let sent = 0;
        for (const job of jobs) {
          try {
            const message = repostTemplate(job as never, job.company as never);
            await whatsappProvider.sendGroupMessage({
              groupId: env.WHATSAPP_GROUP_ID!,
              message,
              imageUrl: job.image_url,
            });
            await jobsRepository.updateWhatsappSentAt(job.id);
            sent++;
          } catch (err) {
            logger.error({ err, jobId: job.id }, '[Cron] repost-featured: falha no repost');
          }
        }

        logger.info({ sent, total: jobs.length }, '[Cron] repost-featured: repost concluído');
      } catch (err) {
        logger.error({ err }, '[Cron] repost-featured: erro geral');
      }
    },
    { timezone: 'America/Fortaleza' },
  );

  logger.info('[Cron] repost-featured agendado — diariamente às 09:00');
}
