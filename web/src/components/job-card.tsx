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
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface JobCardProps {
  job: JobDto;
  showStatus?: boolean;
}

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

function formatExpiresAt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function JobCard({ job, showStatus = false }: JobCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{job.companyName}</span>
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
            {job.companyName.charAt(0).toUpperCase()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showStatus && (
          <div className="mb-3">
            {job.status === 'PENDING' && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                Aguardando Pagamento
              </Badge>
            )}
            {job.status === 'ACTIVE' && (
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                Ativa{job.expiresAt ? ` — expira em ${formatExpiresAt(job.expiresAt)}` : ''}
              </Badge>
            )}
            {job.status === 'EXPIRED' && (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
                Expirada
              </Badge>
            )}
          </div>
        )}

        <div className="relative w-full h-40 mb-3 bg-muted rounded-md overflow-hidden">
          <Image
            src={job.bannerUrl || "/placeholder.png"}
            alt={job.companyName}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className={getTypeColor(job.type)}>
            {jobTypeLabels[job.type]}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-accent" />
            <span>{job.city}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 shrink-0 text-accent" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-accent" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border">
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
      </CardFooter>
    </Card>
  );
}
