"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { LoginResponseDto } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const formSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }).toLowerCase().trim(),
  cpf: z.string().length(11, { message: "CPF deve ter exatamente 11 dígitos." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Backend expects CPF ideally without mask
      const cleanedCpf = values.cpf.replace(/\D/g, "");
      if (cleanedCpf.length !== 11) {
        toast.error("CPF inválido.");
        return;
      }
      
      const res = await apiFetch<LoginResponseDto>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...values, cpf: cleanedCpf }),
      });

      login(res.data.user, res.data.token);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/minhas-vagas");
    } catch (error: any) {
      if (error.errors) {
        // Display validation errors
        Object.values(error.errors).forEach((errMsgs: any) => {
          if (Array.isArray(errMsgs)) {
            errMsgs.forEach(msg => toast.error(msg));
          } else {
            toast.error(errMsgs as string);
          }
        });
      } else {
        toast.error(error.message || "Erro ao realizar cadastro.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border my-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Criar nova conta</h1>
            <p className="text-muted-foreground mt-2">
              Cadastre-se para divulgar suas vagas no Patos Empregos.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo / Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF (apenas números)</FormLabel>
                    <FormControl>
                      <Input placeholder="00000000000" maxLength={11} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Faça login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
