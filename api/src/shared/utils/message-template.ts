import type { Job, Company } from '@/generated/prisma/client';
import { env } from '@config/env';

const APP_URL = env.APP_URL;

const FOOTER = `—\n🌐 *Patos Empregos* · ${new URL(APP_URL).host}\n_Vagas e Oportunidades em Patos-PB_`;

const TYPE_LABELS: Record<string, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  FREELANCER: 'Freelancer',
  INTERNSHIP: 'Estágio',
  TEMPORARY: 'Temporário',
};

function formatArea(area: string): string {
  return area
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function shortDesc(text: string, maxLen = 150): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '...';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' });
}

function daysUntil(date: Date): number {
  const now = new Date();
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function newJobTemplate(job: Job, company: Pick<Company, 'name'>): string {
  const area = formatArea(job.area);
  const type = TYPE_LABELS[job.type] ?? job.type;
  const header = job.plan === 'FEATURED' ? `⭐ *VAGA EM DESTAQUE* | ${area}` : `🚨 *NOVA VAGA* | ${area}`;
  const url = `${APP_URL}/vagas/${job.id}`;

  const lines: string[] = [
    header,
    '',
    `*${job.title}*`,
    `🏢 ${company.name}`,
    '',
    `💼 Contrato: *${type}*`,
    ...(job.salary ? [`💰 Salário: ${job.salary}`] : []),
    '',
    `📋 ${shortDesc(job.description)}`,
    '',
    '🔗 Veja todos os detalhes e candidate-se:',
    url,
    '',
    FOOTER,
  ];

  return lines.join('\n');
}

export function repostTemplate(job: Job, company: Pick<Company, 'name'>): string {
  const area = formatArea(job.area);
  const type = TYPE_LABELS[job.type] ?? job.type;
  const days = job.expires_at ? daysUntil(job.expires_at) : 0;
  const expiresLabel = job.expires_at ? formatDate(job.expires_at) : 'a definir';
  const url = `${APP_URL}/vagas/${job.id}`;

  const lines: string[] = [
    `🔁 *VAGA AINDA DISPONÍVEL* | ${area}`,
    '',
    `*${job.title}*`,
    `🏢 ${company.name}`,
    '',
    `💼 Contrato: *${type}*`,
    ...(job.salary ? [`💰 Salário: ${job.salary}`] : []),
    '',
    `📋 ${shortDesc(job.description)}`,
    '',
    `⏳ Encerra em *${days} ${days === 1 ? 'dia' : 'dias'}* (${expiresLabel})`,
    '',
    '🔗 Ainda dá tempo — candidate-se:',
    url,
    '',
    FOOTER,
  ];

  return lines.join('\n');
}
