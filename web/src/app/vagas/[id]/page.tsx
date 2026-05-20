import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { ApiSuccessResponse, JobDto } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailClient } from "./job-detail-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const BASE_URL = "https://patosempregos.com.br";

async function fetchJob(id: string): Promise<JobDto | null> {
  try {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const body: ApiSuccessResponse<JobDto> = await res.json();
    return body.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(id);
  if (!job) return { title: "Vaga não encontrada | Patos Empregos" };

  const companyName = job.company?.name ?? "Empresa";
  const description = job.description.slice(0, 150).replace(/\n/g, " ");

  return {
    title: `Vaga de ${job.title} em Patos-PB — ${companyName} | Patos Empregos`,
    description,
    openGraph: {
      title: `${job.title} — ${companyName}`,
      description,
      images: job.image_url ? [{ url: job.image_url }] : [],
      type: "website",
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await fetchJob(id);
  if (!job) notFound();

  const companyName = job.company?.name ?? "Empresa";

  const employmentTypeMap: Record<string, string> = {
    CLT: "FULL_TIME",
    PJ: "CONTRACTOR",
    INTERNSHIP: "INTERN",
    TEMPORARY: "TEMPORARY",
    FREELANCER: "OTHER",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      logo: job.company?.logo_url ?? undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Patos",
        addressRegion: "PB",
        addressCountry: "BR",
      },
    },
    datePosted: job.published_at ?? job.createdAt,
    validThrough: job.expires_at ?? undefined,
    employmentType: employmentTypeMap[job.type] ?? "OTHER",
    occupationalCategory: job.area,
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "BRL",
          value: { "@type": "QuantitativeValue", description: job.salary },
        }
      : undefined,
    url: `${BASE_URL}/vagas/${job.id}`,
  };

  // Escape </script> to prevent tag injection when embedding JSON-LD
  const safeJsonLd = JSON.stringify(jsonLd).replace(
    /<\/script>/gi,
    "<\\/script>",
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD schema.org data from our own API, escaped against </script> injection */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
      <Header />
      <JobDetailClient job={job} />
      <Footer />
    </div>
  );
}
