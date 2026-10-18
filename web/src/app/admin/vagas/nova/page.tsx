"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AdminJobForm } from "@/components/admin-job-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminNovaVagaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.type !== "admin")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.type !== "admin") {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/admin/vagas"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para vagas
          </Link>
          <AdminJobForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
