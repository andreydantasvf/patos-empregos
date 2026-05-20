"use client";

import { EmptyState } from "@/components/empty-state";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { JobDto } from "@/lib/types";
import {
  Ban,
  Loader2,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  ATIVA: "bg-green-500/10 text-green-600 border-green-500/20",
  AGUARDANDO_PAGAMENTO: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  SUSPENSA: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  EXPIRADA: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  ATIVA: "Ativa",
  AGUARDANDO_PAGAMENTO: "Aguard. Pagamento",
  SUSPENSA: "Suspensa",
  EXPIRADA: "Expirada",
};

export default function AdminVagasPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [isActing, setIsActing] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.type !== "admin") {
        router.push("/login");
      } else {
        fetchJobs();
      }
    }
  }, [user, authLoading, router]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch<JobDto[]>("/admin/jobs");
      setJobs(res.data);
    } catch {
      toast.error("Erro ao carregar as vagas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;
    try {
      await apiFetch(`/admin/jobs/${id}`, { method: "DELETE" });
      toast.success("Vaga excluída com sucesso.");
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir vaga.");
    }
  };

  const handleSuspend = async () => {
    if (!suspendTarget || suspendReason.trim().length < 5) {
      toast.error("Motivo deve ter pelo menos 5 caracteres.");
      return;
    }
    setIsActing(suspendTarget);
    try {
      await apiFetch(`/admin/jobs/${suspendTarget}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "SUSPENSA",
          motivo: suspendReason.trim(),
        }),
      });
      toast.success("Vaga suspensa.");
      setSuspendTarget(null);
      setSuspendReason("");
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message || "Erro ao suspender vaga.");
    } finally {
      setIsActing(null);
    }
  };

  const handleReactivate = async (id: string) => {
    setIsActing(id);
    try {
      await apiFetch(`/admin/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ATIVA" }),
      });
      toast.success("Vaga reativada.");
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message || "Erro ao reativar vaga.");
    } finally {
      setIsActing(null);
    }
  };

  const handleRepost = async (id: string) => {
    setIsActing(id);
    try {
      await apiFetch(`/admin/jobs/${id}/repostar`, { method: "POST" });
      toast.success("Vaga repostada no WhatsApp.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao repostar vaga.");
    } finally {
      setIsActing(null);
    }
  };

  if (authLoading || !user || user.type !== "admin") {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Administração de Vagas
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as vagas cadastradas na plataforma.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/vagas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Vaga Gratuita
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga encontrada"
            description="Ainda não há vagas cadastradas no sistema."
          />
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          statusStyles[job.status] ??
                          "bg-muted text-muted-foreground"
                        }
                      >
                        {statusLabels[job.status] ?? job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.plan === "FEATURED" ? "Destaque" : "Básico"}
                    </TableCell>
                    <TableCell>
                      {job.expires_at
                        ? new Date(job.expires_at).toLocaleDateString("pt-BR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isActing === job.id}
                          >
                            {isActing === job.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {job.status === "ATIVA" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSuspendTarget(job.id);
                                  setSuspendReason("");
                                }}
                              >
                                <Ban className="mr-2 h-4 w-4 text-orange-500" />
                                Suspender
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRepost(job.id)}
                              >
                                <Send className="mr-2 h-4 w-4 text-blue-500" />
                                Repostar WhatsApp
                              </DropdownMenuItem>
                            </>
                          )}
                          {job.status === "SUSPENSA" && (
                            <DropdownMenuItem
                              onClick={() => handleReactivate(job.id)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4 text-green-500" />
                              Reativar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(job.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />

      <Dialog
        open={!!suspendTarget}
        onOpenChange={(open) => {
          if (!open) {
            setSuspendTarget(null);
            setSuspendReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender vaga</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da suspensão *</Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo da suspensão (mín. 5 caracteres)..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {suspendReason.length}/500
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={suspendReason.trim().length < 5 || !!isActing}
            >
              {isActing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Suspender vaga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
