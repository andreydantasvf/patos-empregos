"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PatosEmpregosLogo from "../../public/menor-no-bg-apenas-logo-patos-empregos.png";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();

  console.log(user)

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

          {user ? (
            <>
              {user.type === "admin" && (
                <Link
                  href="/admin/vagas"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/minhas-vagas"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              >
                Minhas Vagas
              </Link>
              {user.type === "company" && (
                <Link
                  href="/empresa/perfil"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                >
                  Perfil
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/anunciar"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              >
                Para Empresas
              </Link>
              <button
                onClick={() => openAuthModal('login')}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              >
                Entrar
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              >
                Cadastrar
              </button>
            </>
          )}

          {user && user?.type === "admin" ? (
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/admin/vagas/nova">Publicar Vaga</Link>
          </Button>
          ) :
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/publicar-vaga">Publicar Vaga</Link>
          </Button>
          }
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

            {user ? (
              <>
                {user.type === "admin" && (
                  <Link
                    href="/admin/vagas"
                    className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/minhas-vagas"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Minhas Vagas
                </Link>
                {user.type === "company" && (
                  <Link
                    href="/empresa/perfil"
                    className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/anunciar"
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Para Empresas
                </Link>
                <button
                  onClick={() => { openAuthModal('login'); setIsMenuOpen(false); }}
                  className="text-left text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                >
                  Entrar
                </button>
                <button
                  onClick={() => { openAuthModal('register'); setIsMenuOpen(false); }}
                  className="text-left text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                >
                  Cadastrar
                </button>
              </>
            )}

            {user && user?.type === "admin" ? (
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/admin/vagas/nova" onClick={() => setIsMenuOpen(false)}>
                  Publicar Vaga 2
                </Link>
              </Button>
            ) :
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/publicar-vaga" onClick={() => setIsMenuOpen(false)}>
                  Publicar Vaga 3
                </Link>
              </Button>
            }
          </nav>
        </div>
      )}
    </header>
  );
}
