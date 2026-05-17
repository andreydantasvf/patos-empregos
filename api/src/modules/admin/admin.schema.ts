import z from 'zod';

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'EXPIRED'], {
    errorMap: () => ({ message: 'Status deve ser PENDING, ACTIVE ou EXPIRED' }),
  }),
});

export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
