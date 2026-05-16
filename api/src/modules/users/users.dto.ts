import { Role } from '@/generated/prisma/enums';

export interface UserDto {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  nome: string;
  email: string;
  cpf: string;
  password: string;
  role?: Role;
}
