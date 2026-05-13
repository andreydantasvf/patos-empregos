import bcrypt from 'bcryptjs';
import { usersRepository } from '@modules/users/users.repository';
import { jwtProvider } from '@shared/providers/jwt.provider';
import { UnauthorizedError } from '@shared/errors/HttpError';
import { logger } from '@shared/utils/logger';
import { env } from '@config/env';
import type { LoginInput } from './auth.schema';
import type { LoginResponseDto } from './auth.dto';

export const authService = {
  async login(input: LoginInput): Promise<LoginResponseDto> {
    const user = await usersRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      logger.warn({ email: input.email }, '[Auth] Tentativa de login com senha incorreta');
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwtProvider.sign({ sub: user.id, email: user.email, role: user.role });

    logger.info({ userId: user.id, email: user.email }, '[Auth] Login realizado com sucesso');

    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },
};
