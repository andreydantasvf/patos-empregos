import { env } from '@config/env';
import { adminsRepository } from '@modules/admins/admins.repository';
import { companiesRepository } from '@modules/companies/companies.repository';
import { ConflictError, UnauthorizedError } from '@shared/errors/HttpError';
import { jwtProvider } from '@shared/providers/jwt.provider';
import { logger } from '@shared/utils/logger';
import bcrypt from 'bcryptjs';
import type { LoginResponseDto } from './auth.dto';
import type { AdminLoginInput, LoginInput, RegisterInput } from './auth.schema';

export const authService = {
  async login(input: LoginInput): Promise<LoginResponseDto> {
    const company = await companiesRepository.findByEmail(input.email);

    if (!company) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    if (company.blocked) {
      throw new UnauthorizedError('Esta conta foi bloqueada. Entre em contato com o suporte.');
    }

    const isValid = await bcrypt.compare(input.password, company.password);

    if (!isValid) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    const token = jwtProvider.sign({ sub: company.id, email: company.email, type: 'company' });

    return {
      user: { id: company.id, name: company.name, email: company.email, type: 'company' },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },

  async register(input: RegisterInput): Promise<LoginResponseDto> {
    const alreadyExists = await companiesRepository.exists(input.email);
    if (alreadyExists) throw new ConflictError('Este e-mail já está cadastrado');

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const company = await companiesRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      cnpj_cpf: input.cnpj_cpf,
    });

    const token = jwtProvider.sign({ sub: company.id, email: company.email, type: 'company' });

    logger.info({ companyId: company.id, email: company.email }, '[Auth] Empresa registrada');

    return {
      user: { id: company.id, name: company.name, email: company.email, type: 'company' },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },

  async adminLogin(input: AdminLoginInput): Promise<LoginResponseDto> {
    const admin = await adminsRepository.findByEmail(input.email);

    if (!admin) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    const isValid = await bcrypt.compare(input.password, admin.password);

    if (!isValid) {
      throw new UnauthorizedError('E-mail ou senha inválidos');
    }

    const token = jwtProvider.sign({ sub: admin.id, email: admin.email, type: 'admin' });

    logger.info({ adminId: admin.id, email: admin.email }, '[Auth] Admin logado');

    return {
      user: { id: admin.id, name: admin.name, email: admin.email, type: 'admin' },
      token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },
};
