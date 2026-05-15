import { Role } from "@/generated/prisma/enums";

export interface UserDto {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: Role;
}
