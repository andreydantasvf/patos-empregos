import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existing) {
    console.log(`✅ Admin já existe: ${adminEmail}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      nome: 'Admin',
      email: adminEmail,
      cpf: '00000000000',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin criado com sucesso: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
