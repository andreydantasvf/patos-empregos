"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import type { CompanyProfileDto } from "@/lib/types";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CompanyProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<CompanyProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.type !== "company")) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.type !== "company") return;
    const fetchProfile = async () => {
      try {
        const res = await apiFetch<CompanyProfileDto>("/empresa/perfil");
        setProfile(res.data);
        setName(res.data.name);
        setPhone(res.data.phone ?? "");
        setCnpjCpf(res.data.cnpj_cpf ?? "");
        setLogoUrl(res.data.logo_url ?? "");
      } catch {
        toast.error("Erro ao carregar perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    setIsSaving(true);
    try {
      await apiFetch("/empresa/perfil", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          cnpj_cpf: cnpjCpf.trim() || null,
          logo_url: logoUrl.trim() || null,
        }),
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Perfil da Empresa
            </h1>
            <p className="mt-2 text-muted-foreground">
              Gerencie as informações da sua empresa.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da empresa</CardTitle>
              <CardDescription>
                Atualize os dados da sua empresa. O e-mail não pode ser
                alterado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (não editável)</Label>
                  <Input id="email" value={profile?.email ?? ""} disabled />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="name">Nome da empresa *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(83) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj_cpf">CNPJ / CPF (opcional)</Label>
                  <Input
                    id="cnpj_cpf"
                    placeholder="00.000.000/0001-00"
                    value={cnpjCpf}
                    onChange={(e) => setCnpjCpf(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL do logo (opcional)</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    placeholder="https://..."
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
