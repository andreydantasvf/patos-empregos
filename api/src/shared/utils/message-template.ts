import type { Job, Company } from '@/generated/prisma/client';

const AREA_LABELS: Record<string, string> = {
  SAUDE: 'SAÚDE',
  VAREJO: 'VAREJO',
  EDUCACAO: 'EDUCAÇÃO',
  TECNOLOGIA: 'TECNOLOGIA',
  ADMINISTRATIVO: 'ADMINISTRATIVO',
  CONSTRUCAO: 'CONSTRUÇÃO',
  ALIMENTACAO: 'ALIMENTAÇÃO',
  SERVICOS_GERAIS: 'SERVIÇOS GERAIS',
  INDUSTRIA: 'INDÚSTRIA',
  OUTROS: 'OUTROS',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' });
}

function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function newJobTemplate(job: Job, company: Pick<Company, 'name'>): string {
  const area = AREA_LABELS[job.area] ?? job.area;
  const expiresLabel = job.expires_at ? formatDate(job.expires_at) : 'a definir';

  return `🟡 *NOVA VAGA* | ${area}

*${job.title}*
🏢 Empresa: ${company.name}
📅 Válida até: ${expiresLabel}

👉 Ver vaga completa e se candidatar:
${process.env.NEXT_PUBLIC_APP_URL ?? 'https://patosempregos.com.br'}/vagas/${job.id}

—
Patos Empregos · Vagas e Oportunidades`;
}

export function repostTemplate(job: Job, company: Pick<Company, 'name'>): string {
  const area = AREA_LABELS[job.area] ?? job.area;
  const days = job.expires_at ? daysUntil(job.expires_at) : 0;

  return `🔁 *VAGA EM ABERTO* | ${area}

*${job.title}*
🏢 Empresa: ${company.name}
⏳ Ainda válida por ${days} ${days === 1 ? 'dia' : 'dias'}

👉 ${process.env.NEXT_PUBLIC_APP_URL ?? 'https://patosempregos.com.br'}/vagas/${job.id}

—
Patos Empregos · Vagas e Oportunidades`;
}
