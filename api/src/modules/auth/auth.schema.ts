import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }).trim(),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),
  cpf: z
    .string({ required_error: 'CPF é obrigatório' })
    .min(11, 'CPF deve ter no mínimo 11 caracteres')
    .max(11, 'CPF deve ter no máximo 11 caracteres'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
