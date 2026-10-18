import { scheduleExpireJobs } from './expire-jobs.cron';
import { scheduleExpirePayments } from './expire-payments.cron';
import { scheduleRepostBasic } from './repost-basic.cron';
import { scheduleRepostFeatured } from './repost-featured.cron';

export function initCronJobs(): void {
  scheduleExpireJobs();
  scheduleExpirePayments();
  scheduleRepostFeatured();
  scheduleRepostBasic();
}
