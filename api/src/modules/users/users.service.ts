import { usersRepository } from './users.repository';
import type { UserDto } from './users.dto';

export const usersService = {
  async findById(id: string): Promise<UserDto | null> {
    const user = await usersRepository.findById(id);
    if (!user) return null;
    const { password: _pw, ...rest } = user;
    void _pw;
    return rest;
  },
};
