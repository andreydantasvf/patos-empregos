export interface AuthUserDto {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponseDto {
  user: AuthUserDto;
  token: string;
  expiresIn: string;
}
