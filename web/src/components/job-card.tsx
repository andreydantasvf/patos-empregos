"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Job } from "@/lib/types";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Gift,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface JobCardProps {
  job: Job;
}

function formatDate(date: Date): string {
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

function getTypeColor(type: string): string {
  switch (type) {
    case "CLT":
      return "bg-blue-growth/10 text-blue-growth border-blue-growth/20";
    case "PJ":
      return "bg-accent/10 text-accent border-accent/20";
    case "Estágio":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Temporário":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "Freelancer":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}

function getWorkModeColor(mode: string): string {
  switch (mode) {
    case "Presencial":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "Remoto":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "Híbrido":
      return "bg-blue-growth/10 text-blue-growth border-blue-growth/20";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}

export function JobCard({ job }: JobCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = `https://wa.me/55${job.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Olá! Vi a vaga de ${job.position} no Patos Empregos e gostaria de mais informações.`,
  )}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground">
                {job.position}
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
          <Image
            src={job.imgUrl || ""}
            alt={job.companyName}
            width={0}
            height={72}
            className="w-full h-72 object-fill rounded-md mb-3"
          />

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className={getTypeColor(job.type)}>
              {job.type}
            </Badge>
            <Badge variant="outline" className={getWorkModeColor(job.workMode)}>
              {job.workMode}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span>{job.city}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 shrink-0 text-accent" />
                <span>{job.salaryRange}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-accent" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border">
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-blue-growth"
            >
              Ver detalhes
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl font-bold text-primary">
              {job.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{job.position}</DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {job.companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getTypeColor(job.type)}>
              <Briefcase className="mr-1 h-3 w-3" />
              {job.type}
            </Badge>
            <Badge variant="outline" className={getWorkModeColor(job.workMode)}>
              {job.workMode}
            </Badge>
            <Badge variant="outline" className="bg-muted">
              <MapPin className="mr-1 h-3 w-3" />
              {job.city}
            </Badge>
            {job.salaryRange && (
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-600 border-green-500/20"
              >
                <DollarSign className="mr-1 h-3 w-3" />
                {job.salaryRange}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <Briefcase className="h-4 w-4 text-accent" />
              Descrição da vaga
            </h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {job.description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Requisitos
            </h4>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {job.requirements}
            </p>
          </div>

          {job.benefits && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 font-semibold text-foreground">
                <Gift className="h-4 w-4 text-accent" />
                Benefícios
              </h4>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {job.benefits}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              asChild
              className="flex-1 bg-whatsapp text-white hover:bg-whatsapp/90"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Candidatar via WhatsApp
              </a>
            </Button>
            {job.applicationLink && (
              <Button asChild variant="outline" className="flex-1">
                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Link de candidatura
                </a>
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Publicado {formatDate(job.createdAt)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
