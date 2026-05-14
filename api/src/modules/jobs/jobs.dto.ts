import { JobStatus, JobType } from '@/generated/prisma/enums';

export interface JobDto {
  id: string;
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
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDto {
  title: string;
  companyName: string;
  responsibleName: string;
  whatsapp: string;
  city: string;
  type: JobType;
  salary?: string | null;
  description: string;
  requirements: string;
  benefits?: string | null;
  applicationLink?: string | null;
}

export interface JobFilters {
  city?: string;
  type?: JobType;
  company?: string;
  search?: string;
}
