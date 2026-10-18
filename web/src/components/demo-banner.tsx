import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="bg-secondary px-4 py-2 text-center text-xs text-secondary-foreground sm:text-sm">
      <p>
        <span className="whitespace-nowrap">
          <Info
            className="mr-1.5 inline h-4 w-4 -translate-y-px align-middle text-primary"
            aria-hidden="true"
          />
          <strong className="font-semibold text-primary">Demonstração:</strong>
        </span>{" "}
        vagas e empresas
        fictícias. Login e publicação de vagas estão desativados.{" "}
        <a
          href="https://github.com/andreydantasvf/patos-empregos"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium whitespace-nowrap underline underline-offset-2 hover:text-primary"
        >
          Ver código
        </a>
      </p>
    </div>
  );
}
