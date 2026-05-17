"use client";

import { apiFetch } from "@/lib/api";
import type { JobDto, JobType } from "@/lib/types";
import { useEffect, useState } from "react";
import { EmptyState } from "./empty-state";
import { JobCard } from "./job-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { SearchBar } from "./search-bar";

export interface JobFilters {
  search: string;
  type: JobType | "";
  company: string;
}

export function JobList() {
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    type: "",
    company: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.company) params.append("company", filters.company);

      // Fixed page and limit for now, ideally handled with pagination component
      params.append("page", "1");
      params.append("limit", "20");

      const res = await apiFetch<JobDto[]>(`/jobs?${params.toString()}`);
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <section id="vagas" className="scroll-mt-10 py-19 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold text-secondary md:text-4xl">
            Vagas Disponíveis
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore as oportunidades de emprego em Patos-PB e região
          </p>
        </div>

        <div className="mb-8">
          <SearchBar
            filters={filters}
            onFiltersChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga encontrada"
            description="Tente ajustar os filtros ou buscar por outros termos."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
