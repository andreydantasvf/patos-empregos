"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { filterCargoOptions } from "@/lib/cargos";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

interface CargoAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CargoAutocomplete({
  id,
  label,
  value,
  onValueChange,
  placeholder = "Digite ou selecione um cargo...",
  required = false,
}: CargoAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => filterCargoOptions(value), [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              id={id}
              value={value}
              onChange={(event) => {
                onValueChange(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onClick={() => setOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={open}
            />
            <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="max-h-72 overflow-y-auto p-1">
            {suggestions.length > 0 ? (
              suggestions.map((cargo) => {
                const selected = cargo === value;

                return (
                  <Button
                    key={cargo}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-3 py-2 font-normal",
                      selected && "bg-accent text-accent-foreground",
                    )}
                    onClick={() => {
                      onValueChange(cargo);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {capitalize(cargo)}
                  </Button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                {value.trim()
                  ? "Nenhum cargo encontrado. Você pode manter o texto digitado."
                  : "Digite para buscar ou escrever um cargo novo."}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
