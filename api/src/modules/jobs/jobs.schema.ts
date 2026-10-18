import { z } from 'zod';

const JOB_TYPES = ['CLT', 'PJ', 'FREELANCER', 'INTERNSHIP', 'TEMPORARY'] as const;

const applicationLinkSchema = z
  .string({ required_error: 'Link ou e-mail de candidatura é obrigatório' })
  .trim()
  .refine(
    (val) => {
      if (!val) return false;
      const isUrl = /^https?:\/\/.+/.test(val);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      return isUrl || isEmail;
    },
    { message: 'Deve ser uma URL válida (http:// ou https://) ou um e-mail válido' },
  );

export const createJobSchema = z.object({
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .trim(),

  area: z.string().max(50, 'Salário deve ter no máximo 50 caracteres').trim().optional().nullable(),

  type: z.enum(JOB_TYPES, {
    required_error: 'Tipo de contrato é obrigatório',
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
    .min(20, 'Descrição deve ter no mínimo 20 caracteres')
    .max(3000, 'Descrição deve ter no máximo 3000 caracteres')
    .trim(),

  application_link: applicationLinkSchema,

  requirements: z
    .string()
    .max(3000, 'Requisitos devem ter no máximo 3000 caracteres')
    .trim()
    .optional()
    .nullable(),

  benefits: z
    .string()
    .max(2000, 'Benefícios devem ter no máximo 2000 caracteres')
    .trim()
    .optional()
    .nullable(),

  plan: z.enum(['BASIC', 'FEATURED'], {
    required_error: 'Plano é obrigatório',
    invalid_type_error: 'Plano inválido. Use: BASIC ou FEATURED',
  }),
});

export const createJobWithImageSchema = createJobSchema.extend({
  image_url: z.string().url(),
});

export const listJobsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  area: z.string().min(1).max(100).optional(),
  type: z.enum(JOB_TYPES).optional(),
  search: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateJobWithImageInput = z.infer<typeof createJobWithImageSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
