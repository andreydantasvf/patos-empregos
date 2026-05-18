import z from 'zod';
import { createJobSchema } from '@modules/jobs/jobs.schema';

export const createFreeJobSchema = createJobSchema.extend({
  companyId: z
    .string({ required_error: 'Empresa é obrigatória' })
});

export const createFreeJobWithImageSchema = createFreeJobSchema.extend({
  image_url: z.string().url(),
});

export type CreateFreeJobInput = z.infer<typeof createFreeJobSchema>;
export type CreateFreeJobWithImageInput = z.infer<typeof createFreeJobWithImageSchema>;

export const updateJobStatusSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('ATIVA'),
  }),
  z.object({
    status: z.literal('SUSPENSA'),
    motivo: z
      .string({ required_error: 'Motivo da suspensão é obrigatório' })
      .min(5, 'Motivo deve ter no mínimo 5 caracteres')
      .max(500, 'Motivo deve ter no máximo 500 caracteres'),
  }),
  z.object({
    status: z.literal('EXPIRADA'),
  }),
]);

export type UpdateJobStatusDto = z.infer<typeof updateJobStatusSchema>;
