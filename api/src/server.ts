/* eslint-disable @typescript-eslint/no-floating-promises */
import { env } from '@config/env';
import { prisma } from '@config/prisma';
import { logger } from '@shared/utils/logger';
import app from './app';
import { initCronJobs } from './jobs';

const PORT = parseInt(env.PORT, 10);

async function bootstrap() {
  try {
    // Verify DB connection before accepting traffic
    await prisma.$connect();
    logger.info('✅ Banco de dados conectado');

    initCronJobs();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Patos Empregos API rodando em http://localhost:${PORT}`);
      logger.info(`📚 Documentação disponível em http://localhost:${PORT}/docs`);
      logger.info(`🌍 Ambiente: ${env.NODE_ENV}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`[Server] Recebendo ${signal}, encerrando servidor...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('[Server] Servidor encerrado com sucesso');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch {
    logger.error('❌ Falha ao inicializar o servidor');
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
