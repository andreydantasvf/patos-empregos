import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { DEMO_MODE } from "@/lib/config";
import { ArrowLeft, CheckCircle, Clock, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicar Vaga | Patos Empregos",
  description:
    "Publique sua vaga de emprego em Patos-PB de forma rápida e simples. Alcance candidatos da região em menos de 2 minutos.",
  openGraph: {
    title: "Publicar Vaga | Patos Empregos",
    description:
      "Publique sua vaga de emprego em Patos-PB de forma rápida e simples. Planos a partir de R$ 39.",
  },
};

const benefits = [
  {
    icon: Clock,
    text: "Cadastro em menos de 2 minutos",
  },
  {
    icon: Zap,
    text: "Ativação automática após pagamento PIX",
  },
  {
    icon: CheckCircle,
    text: "Divulgação em grupos de WhatsApp",
  },
];

export default function PublicarVagaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para vagas
          </Link>

          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-secondary md:text-4xl">
              Publique sua vaga em Patos-PB
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Alcance candidatos qualificados da região de forma rápida e simples.
              Planos a partir de R$ 39.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-secondary"
                >
                  <benefit.icon className="h-4 w-4 text-accent" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {DEMO_MODE ? (
            <div className="mx-auto max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
              <h2 className="mb-2 text-xl font-semibold text-secondary">
                Publicação desativada na demonstração
              </h2>
              <p className="mb-6 text-muted-foreground">
                Na versão completa, a empresa preenche a vaga, paga via PIX e a vaga é
                ativada e divulgada no WhatsApp automaticamente. Aqui você pode navegar
                pelas vagas fictícias.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/#vagas">Ver vagas</Link>
              </Button>
            </div>
          ) : (
            <JobForm />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
