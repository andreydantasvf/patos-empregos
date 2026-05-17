"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cargos from "@/assets/lista_cargos.json";
import type { JobType } from "@/lib/types";
import { Check, ChevronsUpDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
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

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function SearchBar({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
}: SearchBarProps) {
  const [cargoOpen, setCargoOpen] = useState(false);

  const hasActiveFilters = filters.search || filters.type || filters.area;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "",
      area: "",
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
                Cargo
              </label>
              <Popover open={cargoOpen} onOpenChange={setCargoOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cargoOpen}
                    className="w-full justify-between font-normal"
                  >
                    {filters.area
                      ? capitalize(filters.area)
                      : "Todos os cargos"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar cargo..." />
                    <CommandList>
                      <CommandEmpty>Nenhum cargo encontrado.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value=""
                          onSelect={() => {
                            onFiltersChange({ ...filters, area: "" });
                            setCargoOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${!filters.area ? "opacity-100" : "opacity-0"}`}
                          />
                          Todos os cargos
                        </CommandItem>
                        {(cargos as string[]).map((cargo) => (
                          <CommandItem
                            key={cargo}
                            value={cargo}
                            onSelect={(value) => {
                              onFiltersChange({ ...filters, area: value });
                              setCargoOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${filters.area === cargo ? "opacity-100" : "opacity-0"}`}
                            />
                            {capitalize(cargo)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
