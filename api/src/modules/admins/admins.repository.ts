import { prisma } from '@config/prisma';

export const adminsRepository = {
  async findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.admin.findUnique({ where: { id } });
  },
};
