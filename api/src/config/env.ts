/* eslint-disable no-console */
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Variável vazia no .env conta como ausente
const optional = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined));

// Integrações externas: opcionais em desenvolvimento (a funcionalidade fica
// indisponível e a API responde 503), obrigatórias em produção.
const INTEGRATION_KEYS = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EVOLUTION_URL',
  'EVOLUTION_API_KEY',
  'EVOLUTION_INSTANCE',
  'WHATSAPP_GROUP_ID',
  'MERCADO_PAGO_ACCESS_TOKEN',
  'MERCADO_PAGO_PUBLIC_KEY',
  'MERCADO_PAGO_WEBHOOK_SECRET',
] as const;

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3333'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
    ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
    CORS_ORIGIN: z.string().default('*'),
    APP_URL: z.string().url('APP_URL must be a valid URL').default('http://localhost:5173'),
    CLOUDINARY_CLOUD_NAME: optional,
    CLOUDINARY_API_KEY: optional,
    CLOUDINARY_API_SECRET: optional,
    CLOUDINARY_FOLDER: optional.transform((value) => value ?? 'patos-empregos/banners'),
    EVOLUTION_API_KEY: optional,
    EVOLUTION_URL: optional,
    WHATSAPP_GROUP_ID: optional,
    EVOLUTION_INSTANCE: optional,
    MERCADO_PAGO_ACCESS_TOKEN: optional,
    MERCADO_PAGO_PUBLIC_KEY: optional,
    MERCADO_PAGO_WEBHOOK_SECRET: optional,
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') return;
    for (const key of INTEGRATION_KEYS) {
      if (!data[key]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: `${key} is required` });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
