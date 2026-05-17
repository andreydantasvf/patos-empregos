export type Role = 'ADMIN' | 'ENTERPRISE';

export type JobType = 'CLT' | 'PJ' | 'FREELANCER' | 'INTERNSHIP' | 'TEMPORARY';

export type JobPlan = 'BASIC' | 'PRO';

export type JobStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED';

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

export type AuthUserDto = {
  id: string;
  email: string;
  role: Role;
};

export type LoginResponseDto = {
  user: AuthUserDto;
  token: string;
  expiresIn: string;
};

export type JobDto = {
  id: string;
  userId: string;
  bannerUrl: string;
  title: string;
  companyName: string;
  responsibleName: string;
  email: string;
  whatsapp: string;
  city: string;
  type: JobType;
  salary: string | null;
  description: string;
  requirements: string;
  benefits: string | null;
  applicationLink: string | null;
  plan: JobPlan;
  amountPaid: string;
  paidAt: string | null;
  status: JobStatus;
  expiresAt: string | null;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PixPaymentResponse = {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  ticket_url: string;
};
