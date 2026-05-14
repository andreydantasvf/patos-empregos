import { prisma } from '@config/prisma';
import type { CreateUserDto } from './users.dto';

export const usersRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: CreateUserDto) {
    return prisma.user.create({ data });
  },

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },
};
