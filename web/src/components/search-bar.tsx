"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobType } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { JobFilters } from "./job-list";

interface SearchBarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const jobTypes: JobType[] = [
  "CLT",
  "PJ",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCER",
];

const jobTypeLabels: Record<JobType, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERNSHIP: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCER: "Freelancer",
};

export function SearchBar({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
}: SearchBarProps) {
  const hasActiveFilters =
    filters.search || filters.type || filters.company;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "",
      company: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cargo, empresa..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="h-12 pl-10 pr-4 text-base"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleFilters}
          className={`h-12 px-4 ${showFilters ? "bg-secondary text-secondary-foreground" : ""}`}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Filtros</span>
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tipo da vaga
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    type: value === "all" ? "" : (value as JobType),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {jobTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Empresa
              </label>
              <Input
                type="text"
                placeholder="Nome da empresa"
                value={filters.company}
                onChange={(e) =>
                  onFiltersChange({ ...filters, company: e.target.value })
                }
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="mr-2 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
