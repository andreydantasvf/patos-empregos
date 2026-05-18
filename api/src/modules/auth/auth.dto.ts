export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  type: 'company' | 'admin';
}

export interface LoginResponseDto {
  user: AuthUserDto;
  token: string;
  expiresIn: string;
}
