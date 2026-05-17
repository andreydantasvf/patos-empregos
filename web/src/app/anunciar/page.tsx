import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  MessageSquare,
  Star,
  UserCheck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anuncie Vagas em Patos-PB | Patos Empregos",
  description:
    "Publique sua vaga de emprego em Patos-PB e alcance candidatos locais. Divulgação no site e no grupo de WhatsApp. Planos a partir de R$39.",
};

const steps = [
  {
    number: "1",
    icon: UserCheck,
    title: "Crie sua conta gratuita",
    description:
      "Cadastre sua empresa em menos de 2 minutos. Sem burocracia, só nome, e-mail e senha.",
  },
  {
    number: "2",
    icon: Zap,
    title: "Publique e pague via PIX",
    description:
      "Preencha os dados da vaga, escolha o plano e pague via PIX. Simples e rápido.",
  },
  {
    number: "3",
    icon: MessageSquare,
    title: "Sua vaga vai pro site e WhatsApp",
    description:
      "Assim que o pagamento for confirmado, a vaga é publicada e enviada ao grupo automaticamente.",
  },
];

const basicFeatures = [
  "Publicação por 7 dias",
  "Divulgação no grupo de WhatsApp",
  "Visível na página de vagas",
  "Link ou e-mail para candidatura",
];

const featuredFeatures = [
  "Publicação por 15 dias",
  "Divulgação no grupo de WhatsApp",
  "Destaque no topo da lista",
  "Repost automático a cada 5 dias",
  "Link ou e-mail para candidatura",
];

export default function AnunciarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
              Para Empresas
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Encontre o candidato ideal{" "}
              <span className="text-primary">em Patos-PB</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
              Alcance candidatos locais através do nosso site e do maior grupo
              de vagas de emprego da região no WhatsApp.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 text-base px-8"
            >
              <Link href="/publicar-vaga">
                Publicar minha vaga agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-secondary md:text-4xl">
                Como funciona
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Do cadastro à divulgação em menos de 5 minutos.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-secondary">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planos e Preços */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold text-secondary md:text-4xl">
                Planos e Preços
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Escolha o plano ideal para a sua necessidade.
              </p>
            </div>
            <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
              {/* Plano Básico */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-secondary">
                    Básico
                  </h3>
                  <div className="mb-4 flex items-end gap-1">
                    <span className="text-4xl font-bold text-secondary">
                      R$39
                    </span>
                    <span className="mb-1 text-muted-foreground">/vaga</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {basicFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                    <Link href="/publicar-vaga">Publicar vaga básica</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Destaque */}
              <Card className="border-primary ring-2 ring-primary/20 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Mais popular
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-secondary">
                    Destaque
                  </h3>
                  <div className="mb-4 flex items-end gap-1">
                    <span className="text-4xl font-bold text-secondary">
                      R$79
                    </span>
                    <span className="mb-1 text-muted-foreground">/vaga</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {featuredFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/publicar-vaga">Publicar vaga em destaque</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-secondary py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Pronto para contratar?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/80">
              Publique sua vaga agora e comece a receber candidatos ainda hoje.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
            >
              <Link href="/publicar-vaga">
                Publicar vaga agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
