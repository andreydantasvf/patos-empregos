"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { JobDto, JobType } from "@/lib/types";
import {
  Building2,
  CalendarClock,
  ChevronRight,
  Clock,
  DollarSign,
  Loader2,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
  job: JobDto;
  showStatus?: boolean;
  onRenew?: (jobId: string) => void;
  isRenewing?: boolean;
}

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

function formatExpiresAt(
  dateStr: string,
): { label: string; urgent: boolean } | null {
  const date = new Date(dateStr);
  const now = new Date();
  const days = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days <= 0) return null; // já encerrada — não mostrar no card público
  return null; // mais de 7 dias: não vale a pena mostrar no card
}

function getTypeColor(type: JobType): string {
  switch (type) {
    case "CLT":
      return "bg-blue-growth/10 text-blue-growth border-blue-growth/20";
    case "PJ":
      return "bg-accent/10 text-accent border-accent/20";
    case "INTERNSHIP":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "TEMPORARY":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "FREELANCER":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}

const jobTypeLabels: Record<JobType, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERNSHIP: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCER: "Freelancer",
};

function formatExpiresAtFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const companyInitial = (job: JobDto) =>
  (job.company?.name ?? job.title).charAt(0).toUpperCase();

export function JobCard({
  job,
  showStatus = false,
  onRenew,
  isRenewing = false,
}: JobCardProps) {
  const companyName = job.company?.name ?? "—";
  const publishDate = job.published_at ?? job.createdAt;
  const expiresInfo = job.expires_at ? formatExpiresAt(job.expires_at) : null;

  return (
    <Card
      className={`group relative overflow-hidden border-border bg-card transition-all duration-300 ${job.is_featured ? "ring-2 ring-amber-400/40 border-amber-300/60" : ""}`}
    >
      {job.is_featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-900 shadow">
          <Star className="h-3 w-3 fill-amber-900" />
          Destaque
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{companyName}</span>
            </div>
          </div>

          {/* Logo ou inicial */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
            {job.company?.logo_url ? (
              <Image
                src={job.company.logo_url}
                alt={companyName}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {companyInitial(job)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showStatus && (
          <div className="mb-3">
            {job.status === "AGUARDANDO_PAGAMENTO" && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                Aguardando Pagamento
              </Badge>
            )}
            {job.status === "ATIVA" && (
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                Ativa
                {job.expires_at
                  ? ` — expira em ${formatExpiresAtFull(job.expires_at)}`
                  : ""}
              </Badge>
            )}
            {job.status === "SUSPENSA" && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
                Suspensa
              </Badge>
            )}
            {job.status === "EXPIRADA" && (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
                Expirada
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-center bg-muted/40 px-4 py-6 mb-3 rounded-md">
          <div className="relative w-full h-56 md:h-40">
            <Image
              src={job.image_url}
              alt={companyName}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={getTypeColor(job.type)}>
            {jobTypeLabels[job.type]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {capitalize(job.area)}
          </Badge>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 shrink-0 text-accent" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-accent" />
            <span>Publicado {formatRelativeDate(publishDate)}</span>
          </div>
          {expiresInfo && (
            <div
              className={`flex items-center gap-2 ${expiresInfo.urgent ? "text-red-600 font-medium" : "text-orange-600"}`}
            >
              <CalendarClock className="h-4 w-4 shrink-0" />
              <span>{expiresInfo.label}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-border flex-col items-stretch gap-2">
        {showStatus ? (
          <>
            {job.status === "AGUARDANDO_PAGAMENTO" && (
              <Button asChild className="w-full">
                <Link href={`/pagamento/${job.id}`}>Pagar agora</Link>
              </Button>
            )}
            {job.status === "ATIVA" && (
              <Button
                asChild
                variant="outline"
                className="w-full justify-between text-blue-growth"
              >
                <Link
                  href={`/vagas/${job.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver no site
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {job.status === "SUSPENSA" && (
              <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                <span className="font-medium">Motivo da suspensão:</span>{" "}
                {job.suspension_reason ??
                  "Não informado. Entre em contato com o suporte."}
              </div>
            )}
            {job.status === "EXPIRADA" && (
              <Button
                className="w-full"
                onClick={() => onRenew?.(job.id)}
                disabled={isRenewing}
              >
                {isRenewing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Renovar vaga"
                )}
              </Button>
            )}
          </>
        ) : (
          <Button
            asChild
            variant="ghost"
            className="w-full justify-between text-blue-growth"
          >
            <Link href={`/vagas/${job.id}`}>
              Ver detalhes
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
