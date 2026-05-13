export type JobType = "CLT" | "PJ" | "Estágio" | "Temporário" | "Freelancer";
export type WorkMode = "Presencial" | "Remoto" | "Híbrido";
export type JobStatus = "PENDENTE" | "APROVADO" | "REJEITADO" | "EXPIRADO";

export interface Job {
  id: string;
  imgUrl?: string;
  companyName: string;
  responsibleName: string;
  whatsapp: string;
  position: string;
  city: string;
  type: JobType;
  workMode: WorkMode;
  salaryRange?: string;
  description: string;
  requirements: string;
  benefits?: string;
  applicationLink?: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface JobFormData {
  companyName: string;
  responsibleName: string;
  whatsapp: string;
  position: string;
  city: string;
  type: JobType;
  workMode: WorkMode;
  salaryRange?: string;
  description: string;
  requirements: string;
  benefits?: string;
  applicationLink?: string;
}

export interface JobFilters {
  search: string;
  type: JobType | "";
  workMode: WorkMode | "";
  company: string;
}
