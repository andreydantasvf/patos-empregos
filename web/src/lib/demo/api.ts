import type { ApiSuccessResponse } from "@/lib/types";
import { getDemoJob, listDemoJobs } from "./jobs";

export const DEMO_UNAVAILABLE_MESSAGE =
  "Indisponível na demonstração: aqui só é possível navegar pelas vagas.";

// Responde, sem rede, às rotas públicas de vagas que o front-end usa. As demais
// (login, cadastro, publicação, painel) não existem na demo e devolvem null.
export function demoResponse<T>(endpoint: string, method = "GET"): ApiSuccessResponse<T> | null {
  if (method.toUpperCase() !== "GET") return null;

  const url = new URL(endpoint, "http://demo.local");
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] !== "jobs") return null;

  if (segments.length === 1) {
    const { jobs, meta } = listDemoJobs({
      search: url.searchParams.get("search"),
      type: url.searchParams.get("type"),
      area: url.searchParams.get("area"),
      page: Number(url.searchParams.get("page")) || 1,
      limit: Number(url.searchParams.get("limit")) || 10,
    });
    return { success: true, data: jobs as T, message: "Vagas listadas com sucesso", meta };
  }

  if (segments.length === 2 && segments[1] !== "me") {
    const job = getDemoJob(segments[1]);
    if (job) return { success: true, data: job as T, message: "Vaga encontrada" };
  }

  return null;
}
