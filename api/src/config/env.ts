/* eslint-disable no-console */
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3333'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),
  CORS_ORIGIN: z.string().default('*'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  EVOLUTION_API_KEY: z.string().min(1, 'EVOLUTION_API_KEY is required'),
  EVOLUTION_URL: z.string().min(1, 'EVOLUTION_URL is required'),
  WHATSAPP_GROUP_ID: z.string().min(1, 'EVOLUTION_GROUP_ID is required'),
  EVOLUTION_INSTANCE: z.string().min(1, 'EVOLUTION_INSTANCE is required'),
  // MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1, 'MERCADO_PAGO_ACCESS_TOKEN is required'),
  // MERCADO_PAGO_PUBLIC_KEY: z.string().min(1, 'MERCADO_PAGO_PUBLIC_KEY is required'),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().min(1, 'MERCADO_PAGO_WEBHOOK_SECRET is required'),
  TESTE_MERCADO_PAGO_PUBLIC_KEY: z.string().min(1, 'TESTE_MERCADO_PAGO_PUBLIC_KEY is required'),
  TESTE_MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1, 'TESTE_MERCADO_PAGO_ACCESS_TOKEN is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
