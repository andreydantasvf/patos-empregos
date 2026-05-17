import type { JobPlan, JobType } from "@/lib/types";

const JOB_DRAFT_STORAGE_KEY = "patos-empregos:job-draft";

export type JobDraftFormData = {
  title: string;
  companyName: string;
  email: string;
  responsibleName: string;
  whatsapp: string;
  city: string;
  type: JobType;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  applicationLink: string;
  plan: JobPlan;
};

export type JobDraftBanner = {
  dataUrl: string;
  name: string;
  type: string;
};

export type SavedJobDraft = {
  formData: JobDraftFormData;
  banner: JobDraftBanner | null;
  savedAt: string;
};

const canUseStorage = () => typeof window !== "undefined";

export const hasSavedJobDraft = () => {
  if (!canUseStorage()) {
    return false;
  }

  return Boolean(localStorage.getItem(JOB_DRAFT_STORAGE_KEY));
};

export const loadJobDraft = (): SavedJobDraft | null => {
  if (!canUseStorage()) {
    return null;
  }

  const rawDraft = localStorage.getItem(JOB_DRAFT_STORAGE_KEY);
  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as SavedJobDraft;

    if (!parsedDraft?.formData || typeof parsedDraft.savedAt !== "string") {
      return null;
    }

    return parsedDraft;
  } catch {
    return null;
  }
};

export const saveJobDraft = (draft: SavedJobDraft) => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(JOB_DRAFT_STORAGE_KEY, JSON.stringify(draft));
};

export const clearJobDraft = () => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(JOB_DRAFT_STORAGE_KEY);
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Não foi possível ler o arquivo do banner."));
    };

    reader.onerror = () => {
      reject(new Error("Não foi possível ler o arquivo do banner."));
    };

    reader.readAsDataURL(file);
  });

export const dataUrlToFile = async (
  dataUrl: string,
  fileName: string,
  fileType: string,
) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: fileType });
};
