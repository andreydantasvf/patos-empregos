import { prisma } from '@config/prisma';
import type { CreateCompanyDto } from './companies.dto';

export const companiesRepository = {
  async findByEmail(email: string) {
    return prisma.company.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.company.findUnique({ where: { id } });
  },

  async create(data: CreateCompanyDto) {
    return prisma.company.create({ data });
  },

  async exists(email: string): Promise<boolean> {
    const count = await prisma.company.count({ where: { email } });
    return count > 0;
  },

  async update(id: string, data: {
    name?: string;
    phone?: string | null;
    cnpj_cpf?: string | null;
    logo_url?: string | null;
    password?: string;
  }) {
    return prisma.company.update({ where: { id }, data });
  },

  async findAll() {
    return prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cnpj_cpf: true,
        logo_url: true,
        blocked: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async toggleBlock(id: string, blocked: boolean) {
    return prisma.company.update({ where: { id }, data: { blocked } });
  },
};
