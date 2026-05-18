import { scheduleExpireJobs } from './expire-jobs.cron';
import { scheduleExpirePayments } from './expire-payments.cron';
import { scheduleRepostFeatured } from './repost-featured.cron';

export function initCronJobs(): void {
  scheduleExpireJobs();
  scheduleExpirePayments();
  scheduleRepostFeatured();
}
