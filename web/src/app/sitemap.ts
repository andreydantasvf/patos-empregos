import type { MetadataRoute } from "next";

const BASE = "https://patosempregos.com.br";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/publicar-vaga`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/anunciar`, changeFrequency: "monthly", priority: 0.8 },
  ];

  try {
    const res = await fetch(`${API_URL}/jobs?limit=500&page=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return staticRoutes;
    const body = await res.json();
    const jobs: Array<{ id: string; updatedAt: string; plan: string }> = body.data ?? [];
    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${BASE}/vagas/${job.id}`,
      lastModified: new Date(job.updatedAt),
      changeFrequency: "weekly" as const,
      priority: job.plan === "FEATURED" ? 0.9 : 0.8,
    }));
    return [...staticRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
