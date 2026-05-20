import cargos from "@/assets/lista_cargos.json";

export const cargoOptions = cargos as string[];

function normalizeCargo(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterCargoOptions(query: string, limit = 12): string[] {
  const normalizedQuery = normalizeCargo(query);

  if (!normalizedQuery) {
    return [];
  }

  return cargoOptions
    .filter((cargo) => normalizeCargo(cargo).includes(normalizedQuery))
    .slice(0, limit);
}
