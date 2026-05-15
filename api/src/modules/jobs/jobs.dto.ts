import { JobPlan, JobType } from '@/generated/prisma/enums';

export interface JobDto {
  id: string;
  bannerUrl: string;
  title: string;
  companyName: string;
  responsibleName: string;
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
  paidAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDto {
  userId: string;
  bannerUrl: string;
  title: string;
  companyName: string;
  responsibleName: string;
  email: string;
  whatsapp: string;
  city: string;
  type: JobType;
  salary?: string | null;
  description: string;
  requirements: string;
  benefits?: string | null;
  applicationLink?: string | null;
  plan: JobPlan;
  amountPaid: string;
}

export interface JobFilters {
  city?: string;
  type?: JobType;
  company?: string;
  search?: string;
}
