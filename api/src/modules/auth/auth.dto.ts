import { Role } from "@/generated/prisma/enums";

export interface AuthUserDto {
  id: string;
  email: string;
  role: Role;
}

export interface LoginResponseDto {
  user: AuthUserDto;
  token: string;
  expiresIn: string;
}
