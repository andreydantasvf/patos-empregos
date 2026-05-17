"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { hasSavedJobDraft } from "@/lib/job-draft";
import { LoginResponseDto } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }).toLowerCase().trim(),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("draft") === "1") {
      setIsPromptOpen(true);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const res = await apiFetch<LoginResponseDto>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      login(res.data.user, res.data.token);
      toast.success("Login realizado com sucesso!");

      if (hasSavedJobDraft()) {
        router.push("/publicar-vaga");
      } else if (res.data.user.role === "ADMIN") {
        router.push("/admin/vagas");
      } else {
        router.push("/minhas-vagas");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordOpen = () => {
    setPasswordOpen(!passwordOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvamos sua vaga</DialogTitle>
            <DialogDescription>
              Você ainda não estava autenticado. Seus dados foram guardados para
              que você possa entrar e continuar a publicação sem perder o que já
              preencheu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsPromptOpen(false)}
              className="w-full sm:w-auto"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Entrar na sua conta
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas vagas e alcance os melhores candidatos.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={passwordOpen ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />

                        {passwordOpen ? (
                          <EyeClosed
                            onClick={handlePasswordOpen}
                            className="mr-2 cursor-pointer"
                          />
                        ) : (
                          <Eye
                            onClick={handlePasswordOpen}
                            className="mr-2 cursor-pointer"
                          />
                        )}
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
