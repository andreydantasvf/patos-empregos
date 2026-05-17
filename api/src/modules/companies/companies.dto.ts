export interface CompanyDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cnpj_cpf: string | null;
  logo_url: string | null;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  cnpj_cpf?: string;
  logo_url?: string;
}
