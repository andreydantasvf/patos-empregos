"use client";

import type { Job, JobFilters } from "@/lib/types";
import { useMemo, useState } from "react";
import { EmptyState } from "./empty-state";
import { JobCard } from "./job-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { SearchBar } from "./search-bar";

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
}

export function JobList({ jobs, isLoading = false }: JobListProps) {
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    type: "",
    workMode: "",
    company: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          job.position.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type && job.type !== filters.type) {
        return false;
      }

      // Work mode filter
      if (filters.workMode && job.workMode !== filters.workMode) {
        return false;
      }

      // Company filter
      if (filters.company) {
        const companyLower = filters.company.toLowerCase();
        if (!job.companyName.toLowerCase().includes(companyLower)) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

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

        {!isLoading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length === 0
                ? "Nenhuma vaga encontrada"
                : filteredJobs.length === 1
                  ? "1 vaga encontrada"
                  : `${filteredJobs.length} vagas encontradas`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga encontrada"
            description="Tente ajustar os filtros ou buscar por outros termos."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
