import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PatosEmpregosLogo from "../../public/menor-no-bg-apenas-logo-patos-empregos.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={PatosEmpregosLogo}
                alt="Patos Empregos"
                className="h-16 w-16"
              />
              <span className="text-xl font-bold text-white">
                Patos<span className="text-primary">Empregos</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Conectando talentos e empresas em Patos-PB. As melhores
              oportunidades de emprego da região em um só lugar.
            </p>
            <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
              <MapPin className="h-4 w-4" />
              <span>Patos, Paraíba - Brasil</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Links Úteis</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                Início
              </Link>
              <Link
                href="/#vagas"
                className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                Ver Vagas
              </Link>
              <Link
                href="/publicar-vaga"
                className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                Publicar Vaga
              </Link>
              <Link
                href="/#sobre"
                className="text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                Sobre Nós
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contato</h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:techgenesisweb@gmail.com"
                className="flex items-center gap-2 text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>techgenesisweb@gmail.com</span>
              </a>
              <a
                href="https://wa.me/5583999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-secondary-foreground/80 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>(83) 99999-9999</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/genesisweb.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-foreground/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Patos Empregos. Todos os direitos
              reservados.
            </p>
            <p className="text-sm text-secondary-foreground/60">
              Desenvolvido por{" "}
              <a
                target="_blank"
                href="https://www.instagram.com/genesisweb.tech/"
              >
                Genesis Web
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
