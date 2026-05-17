"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JobDto } from "@/lib/types";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Gift,
  Mail,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const jobTypeLabels: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERNSHIP: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCER: "Freelancer",
};

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function formatRelativeDate(dateStr: string): string {
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

function formatExpiresAt(dateStr: string): { label: string; urgent: boolean } {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return { label: "Encerrada", urgent: true };
  return {
    label: `Válida até ${date.toLocaleDateString("pt-BR")}`,
    urgent: false,
  };
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function JobDetailClient({ job }: { job: JobDto }) {
  const companyName = job.company?.name ?? "—";
  const publishDate = job.published_at ?? job.createdAt;

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para vagas
        </Link>
      </Button>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        {/* Imagem da vaga */}
        {job.image_url && (
          <div className="flex justify-center bg-muted/40 px-4 py-6">
            <div className="relative w-full max-w-lg aspect-square">
              <Image
                src={job.image_url}
                alt={job.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 512px"
              />
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Cabeçalho: título + empresa + avatar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
            <div className="flex-1">
              {job.is_featured && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-600">
                    Vaga em Destaque
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5 shrink-0" />
                <span className="text-lg">{companyName}</span>
              </div>
            </div>

            {/* Logo ou inicial da empresa */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 overflow-hidden">
              {job.company?.logo_url ? (
                <Image
                  src={job.company.logo_url}
                  alt={companyName}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Badges de informação */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              <Briefcase className="mr-2 h-4 w-4" />
              {jobTypeLabels[job.type] ?? job.type}
            </Badge>

            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              {capitalize(job.area)}
            </Badge>

            {job.salary && (
              <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 border-green-200">
                <DollarSign className="mr-1 h-4 w-4" />
                {job.salary}
              </Badge>
            )}

            <Badge variant="outline" className="px-3 py-1 text-sm font-medium text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Publicado {formatRelativeDate(publishDate)}
            </Badge>

            {job.expires_at && (() => {
              const { label, urgent } = formatExpiresAt(job.expires_at);
              return (
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-sm font-medium ${
                    urgent
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {label}
                </Badge>
              );
            })()}
          </div>

          {/* Detalhes em grid */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Contrato</p>
              <p className="font-medium">{jobTypeLabels[job.type] ?? job.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Cargo</p>
              <p className="font-medium">{capitalize(job.area)}</p>
            </div>
            {job.salary && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Salário</p>
                <p className="font-medium">{job.salary}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Empresa</p>
              <p className="font-medium">{companyName}</p>
            </div>
            {job.published_at && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Publicada em</p>
                <p className="font-medium">
                  {new Date(job.published_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            {job.expires_at && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Válida até</p>
                <p className="font-medium flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(job.expires_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </div>

          {/* Conteúdo textual */}
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

            {job.requirements && (
              <section>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-4">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  Requisitos
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                  {job.requirements}
                </div>
              </section>
            )}

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

          {/* CTA de candidatura */}
          {job.application_link && (
            <div className="mt-10 pt-8 border-t">
              {isEmail(job.application_link) ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Envie seu currículo para:
                  </span>
                  <a
                    href={`mailto:${job.application_link}`}
                    className="flex items-center gap-2 text-base font-semibold text-accent hover:underline break-all"
                  >
                    <Mail className="h-5 w-5 shrink-0" />
                    {job.application_link}
                  </a>
                </div>
              ) : (
                <Button asChild size="lg" className="w-full sm:w-auto text-base">
                  <a href={job.application_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Candidatar-se
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
