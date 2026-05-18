"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { JobDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Gift,
  MapPin,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { toast } from "sonner";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30)
    return `${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? "s" : ""} atrás`;
  return `${Math.floor(days / 30)} mês${Math.floor(days / 30) > 1 ? "es" : ""} atrás`;
}

const jobTypeLabels: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERNSHIP: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCER: "Freelancer",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await apiFetch<JobDto>(`/jobs/${params.id}`);
        setJob(res.data);
      } catch (error: any) {
        if (error.statusCode === 404) {
          toast.error("Vaga não encontrada ou expirada.");
          router.push("/");
        } else {
          toast.error("Erro ao carregar detalhes da vaga.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  const whatsappLink = `https://wa.me/55${job.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Olá! Vi a vaga de ${job.title} no Patos Empregos e gostaria de mais informações.`,
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para vagas
          </Link>
        </Button>

        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          {job.bannerUrl && (
            <div className="w-full h-64 relative bg-muted">
              <Image
                src={job.bannerUrl}
                alt={job.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                  <span className="text-lg">{job.companyName}</span>
                </div>
              </div>
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl font-bold text-primary">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                <Briefcase className="mr-2 h-4 w-4" />
                {jobTypeLabels[job.type] || job.type}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                <MapPin className="mr-2 h-4 w-4" />
                {job.city}
              </Badge>
              {job.salary && (
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 border-green-200">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {job.salary}
                </Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 text-sm font-medium text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Publicado {formatDate(job.createdAt)}
              </Badge>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-4">
                  <Briefcase className="h-5 w-5 text-accent" />
                  Descrição da vaga
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                  {job.description}
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-4">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Requisitos
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                  {job.requirements}
                </div>
              </section>

              {job.benefits && (
                <section>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-4">
                    <Gift className="h-5 w-5 text-accent" />
                    Benefícios
                  </h2>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                    {job.benefits}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="flex-1 bg-whatsapp text-white hover:bg-whatsapp/90 text-base">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Candidatar via WhatsApp
                </a>
              </Button>
              {job.applicationLink && (
                <Button asChild size="lg" variant="outline" className="flex-1 text-base">
                  <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Link de candidatura
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
