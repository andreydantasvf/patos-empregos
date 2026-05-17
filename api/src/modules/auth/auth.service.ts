import { Role } from '@/generated/prisma/enums';
import { env } from '@config/env';
import { usersRepository } from '@modules/users/users.repository';
import { ConflictError, UnauthorizedError } from '@shared/errors/HttpError';
import { jwtProvider } from '@shared/providers/jwt.provider';
import { logger } from '@shared/utils/logger';
import bcrypt from 'bcryptjs';
import type { LoginResponseDto } from './auth.dto';
import type { LoginInput, RegisterInput } from './auth.schema';

export const authService = {
  async login(input: LoginInput): Promise<LoginResponseDto> {
    const user = await usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwtProvider.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },

  async register(input: RegisterInput): Promise<LoginResponseDto> {
    const alreadyExists = await usersRepository.exists(input.email);
    if (alreadyExists) throw new ConflictError('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const payload = {
      ...input,
      password: hashedPassword,
      role: Role.ENTERPRISE,
    };
    const user = await usersRepository.create(payload);

    const token = jwtProvider.sign({ sub: user.id, email: user.email, role: user.role });

    logger.info({ userId: user.id, email: user.email }, '[Auth] Registro realizado com sucesso');

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },
};
