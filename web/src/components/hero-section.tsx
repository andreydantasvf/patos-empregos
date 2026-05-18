import { Button } from "@/components/ui/button";
import { ArrowRight, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white-paper via-white-paper to-primary/5 py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-secondary">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span>Vagas de emprego em Patos-PB e região</span>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-secondary md:text-5xl lg:text-6xl">
            Encontre oportunidades de emprego em{" "}
            <span className="relative">
              <span className="relative z-10 text-accent">Patos-PB</span>
              <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-primary/30" />
            </span>
            {" "}e região.
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            As vagas do sertão reunidas em um só lugar. Conectamos candidatos e
            empresas de forma rápida, simples e gratuita.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              <Link href="/#vagas">
                <Search className="mr-2 h-5 w-5" />
                Ver Vagas
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground sm:w-auto"
            >
              <Link href="/anunciar">
                Anunciar vaga
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
