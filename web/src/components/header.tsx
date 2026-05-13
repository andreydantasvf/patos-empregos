"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PatosEmpregosLogo from "../../public/menor-no-bg-apenas-logo-patos-empregos.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white-paper/95 backdrop-blur supports-backdrop-filter:bg-white-paper/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={PatosEmpregosLogo}
            alt="Patos Empregos"
            className="h-16 w-16 p-2"
          />
          <span className="text-xl font-bold text-secondary">
            Patos<span className="text-accent">Empregos</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            Início
          </Link>
          <Link
            href="/#vagas"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            Ver Vagas
          </Link>
          <Link
            href="/#sobre"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            Sobre
          </Link>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/publicar-vaga">Publicar Vaga</Link>
          </Button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border/40 bg-white-paper md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/#vagas"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Ver Vagas
            </Link>
            <Link
              href="/#sobre"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/publicar-vaga" onClick={() => setIsMenuOpen(false)}>
                Publicar Vaga
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
