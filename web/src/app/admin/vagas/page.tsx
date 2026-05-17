"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EmptyState } from "@/components/empty-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { apiFetch } from "@/lib/api";
import { JobDto } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminVagasPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
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
    } catch (error: any) {
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

  if (authLoading || !user || user.role !== "ADMIN") {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary">Administração de Vagas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as vagas cadastradas na plataforma.
          </p>
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
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          job.status === "ACTIVE"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : job.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
