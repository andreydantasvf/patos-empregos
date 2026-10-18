export function formatSalaryFromDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const cents = Number.parseInt(digits, 10);
  if (Number.isNaN(cents)) return "";

  const amount = cents / 100;
  const formatted = amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    minimumIntegerDigits: 4,
  });

  return `R$ ${formatted}`;
}
