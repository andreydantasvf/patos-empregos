import { Job } from '@/generated/prisma/client';

export const messageTemplate = (job: Job) => {
  return `
🚨 NOVA VAGA EM PATOS-PB

💼 Cargo: ${job.title}
📍 Cidade: ${job.city}

🔗 Analise e Candidate-se:
https://patosempregos.com.br/vagas/${job.id}
`;
};
