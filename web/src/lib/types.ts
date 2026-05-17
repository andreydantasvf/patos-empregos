export type JobArea =
  | 'SAUDE'
  | 'VAREJO'
  | 'EDUCACAO'
  | 'TECNOLOGIA'
  | 'ADMINISTRATIVO'
  | 'CONSTRUCAO'
  | 'ALIMENTACAO'
  | 'SERVICOS_GERAIS'
  | 'INDUSTRIA'
  | 'OUTROS';

export type JobType = 'CLT' | 'PJ' | 'FREELANCER' | 'INTERNSHIP' | 'TEMPORARY';

export type JobPlan = 'BASIC' | 'FEATURED';

export type JobStatus = 'AGUARDANDO_PAGAMENTO' | 'ATIVA' | 'SUSPENSA' | 'EXPIRADA';

export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'EXPIRED';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: string;
  meta?: PaginationMeta;
};

export type ApiErrorResponse = {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]> | string[];
};

export type CompanyBasicDto = {
  id: string;
  name: string;
  logo_url: string | null;
};

export type CompanyProfileDto = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cnpj_cpf: string | null;
  logo_url: string | null;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthUserDto = {
  id: string;
  name: string;
  email: string;
  type: 'company' | 'admin';
};

export type LoginResponseDto = {
  user: AuthUserDto;
  token: string;
  expiresIn: string;
};

export type JobDto = {
  id: string;
  companyId: string;
  company?: CompanyBasicDto;
  title: string;
  description: string;
  area: JobArea;
  type: JobType;
  salary: string | null;
  image_url: string;
  application_link: string;
  plan: JobPlan;
  status: JobStatus;
  is_featured: boolean;
  published_at: string | null;
  expires_at: string | null;
  whatsapp_sent_at: string | null;
  suspension_reason: string | null;
  requirements: string | null;
  benefits: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentResponseDto = {
  preferenceId: string;
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  amount: number;
};

export type PaymentStatusDto = {
  status: PaymentStatus;
  confirmedAt: string | null;
  plan: JobPlan;
  amount: number;
};
