import z from 'zod';

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
