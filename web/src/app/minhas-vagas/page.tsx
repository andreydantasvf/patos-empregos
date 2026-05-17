"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JobCard } from "@/components/job-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { apiFetch } from "@/lib/api";
import { JobDto } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MinhasVagasPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch<JobDto[]>("/jobs/me");
      setJobs(res.data);
    } catch (error: any) {
      toast.error("Erro ao carregar suas vagas.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Minhas Vagas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as vagas que você publicou.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/publicar-vaga">
              <Plus className="h-4 w-4" />
              Nova Vaga
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Você ainda não publicou nenhuma vaga"
            description="Clique no botão acima para publicar sua primeira vaga."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} showStatus />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
