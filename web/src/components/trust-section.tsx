import { Button } from "@/components/ui/button";
import { Building2, MapPin, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MapPin,
    title: "Vagas Locais",
    description: "Oportunidades reais de empresas da cidade de Patos e região.",
  },
  {
    icon: Zap,
    title: "Publicação Rápida",
    description:
      "Cadastre sua vaga em menos de 2 minutos. Simples e sem burocracia.",
  },
  {
    icon: Building2,
    title: "Empresas da Região",
    description:
      "Conectamos candidatos com empresas locais que você conhece e confia.",
  },
  {
    icon: MessageCircle,
    title: "Divulgação no WhatsApp",
    description:
      "Vagas divulgadas diretamente em grupos de WhatsApp da cidade.",
  },
];

export function TrustSection() {
  return (
    <section id="sobre" className="scroll-mt-20 bg-muted/50 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-secondary">
            Por que escolher o Patos Empregos?
          </span>
          <h2 className="mb-4 text-3xl font-bold text-secondary md:text-4xl">
            Conectando Empresas e Candidatos
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A plataforma mais simples e eficiente para encontrar emprego ou
            divulgar vagas em Patos-PB.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-accent transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-secondary p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Você é empresa e precisa contratar?
          </h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Anuncie sua vaga e alcance candidatos locais em Patos-PB.
            Divulgação no site e no WhatsApp a partir de R$39.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/anunciar">Ver planos e preços →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
