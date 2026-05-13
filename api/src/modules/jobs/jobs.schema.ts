import { z } from 'zod';

const phoneRegex = /^(\+55)?(\s)?\(?[1-9]{2}\)?(\s)?9?[6-9][0-9]{3}[-\s]?[0-9]{4}$/;

export const createJobSchema = z.object({
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(150, 'Título deve ter no máximo 150 caracteres')
    .trim(),

  companyName: z
    .string({ required_error: 'Nome da empresa é obrigatório' })
    .min(2, 'Nome da empresa deve ter no mínimo 2 caracteres')
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .trim(),

  responsibleName: z
    .string({ required_error: 'Nome do responsável é obrigatório' })
    .min(3, 'Nome do responsável deve ter no mínimo 3 caracteres')
    .max(100, 'Nome do responsável deve ter no máximo 100 caracteres')
    .trim(),

  whatsapp: z
    .string({ required_error: 'WhatsApp é obrigatório' })
    .regex(phoneRegex, 'Formato de WhatsApp inválido. Ex: (83) 99999-9999')
    .trim(),

  city: z
    .string({ required_error: 'Cidade é obrigatória' })
    .min(2, 'Cidade deve ter no mínimo 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .trim(),

  type: z.enum(['CLT', 'PJ', 'FREELANCER', 'INTERNSHIP', 'TEMPORARY'], {
    required_error: 'Tipo de vaga é obrigatório',
    invalid_type_error: 'Tipo inválido. Use: CLT, PJ, FREELANCER, INTERNSHIP ou TEMPORARY',
  }),

  salary: z
    .string()
    .max(50, 'Salário deve ter no máximo 50 caracteres')
    .trim()
    .optional()
    .nullable(),

  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(30, 'Descrição deve ter no mínimo 30 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .trim(),

  requirements: z
    .string({ required_error: 'Requisitos são obrigatórios' })
    .min(10, 'Requisitos devem ter no mínimo 10 caracteres')
    .max(3000, 'Requisitos devem ter no máximo 3000 caracteres')
    .trim(),

  benefits: z
    .string()
    .max(2000, 'Benefícios devem ter no máximo 2000 caracteres')
    .trim()
    .optional()
    .nullable(),

  applicationLink: z
    .string()
    .url('Link de candidatura deve ser uma URL válida')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),
});

export const listJobsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['CLT', 'PJ', 'FREELANCER', 'INTERNSHIP', 'TEMPORARY']).optional(),
  company: z.string().optional(),
  search: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
