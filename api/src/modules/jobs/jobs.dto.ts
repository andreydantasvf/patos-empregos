import type { JobArea, JobPlan, JobStatus, JobType } from '@/generated/prisma/enums';

export interface CompanyBasicDto {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface JobDto {
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
  published_at: Date | null;
  expires_at: Date | null;
  whatsapp_sent_at: Date | null;
  suspension_reason: string | null;
  requirements: string | null;
  benefits: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDto {
  companyId: string;
  title: string;
  description: string;
  area: JobArea;
  type: JobType;
  salary?: string | null;
  image_url: string;
  application_link: string;
  plan: JobPlan;
  requirements?: string | null;
  benefits?: string | null;
}

export interface JobFilters {
  companyId?: string;
  area?: JobArea;
  type?: JobType;
  search?: string;
  status?: JobStatus;
}
