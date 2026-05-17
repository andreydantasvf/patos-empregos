"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiFetch } from "@/lib/api";
import type { LoginResponseDto } from "@/lib/types";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }).toLowerCase().trim(),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

const registerSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }).toLowerCase().trim(),
  cpf: z.string().length(11, { message: "CPF deve ter exatamente 11 dígitos." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab: "login" | "register";
  onSuccess: (user: LoginResponseDto["user"], token: string) => void;
}

function LoginForm({ onSuccess }: { onSuccess: AuthModalProps["onSuccess"] }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsLoading(true);
      const res = await apiFetch<LoginResponseDto>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Login realizado com sucesso!");
      onSuccess(res.data.user, res.data.token);
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                <Input type="password" placeholder="******" {...field} />
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
  );
}

function RegisterForm({ onSuccess }: { onSuccess: AuthModalProps["onSuccess"] }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", cpf: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setIsLoading(true);
      const cleanedCpf = values.cpf.replace(/\D/g, "");
      if (cleanedCpf.length !== 11) {
        toast.error("CPF inválido.");
        return;
      }
      const res = await apiFetch<LoginResponseDto>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...values, cpf: cleanedCpf }),
      });
      toast.success("Cadastro realizado com sucesso!");
      onSuccess(res.data.user, res.data.token);
    } catch (error: any) {
      if (error.errors) {
        Object.values(error.errors).forEach((errMsgs: any) => {
          if (Array.isArray(errMsgs)) {
            errMsgs.forEach((msg) => toast.error(msg));
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}

export function AuthModal({ open, onOpenChange, defaultTab, onSuccess }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} key={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
