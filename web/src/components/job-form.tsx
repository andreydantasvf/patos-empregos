"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { JobPlan, JobType } from "@/lib/types";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Crown,
  FileText,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const jobTypes: JobType[] = [
  "CLT",
  "PJ",
  "INTERNSHIP",
  "TEMPORARY",
  "FREELANCER",
];

const jobTypeLabels: Record<JobType, string> = {
  CLT: "CLT",
  PJ: "PJ",
  INTERNSHIP: "Estágio",
  TEMPORARY: "Temporário",
  FREELANCER: "Freelancer",
};

interface CreateJobFormValues {
  title: string;
  companyName: string;
  email: string;
  responsibleName: string;
  whatsapp: string;
  city: string;
  type: JobType;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  applicationLink: string;
  plan: JobPlan;
}

const initialFormData: CreateJobFormValues = {
  title: "",
  companyName: "",
  email: "",
  responsibleName: "",
  whatsapp: "",
  city: "Patos-PB",
  type: "CLT",
  salary: "",
  description: "",
  requirements: "",
  benefits: "",
  applicationLink: "",
  plan: "BASIC",
};

export function JobForm() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();

  const [formData, setFormData] = useState<CreateJobFormValues>(initialFormData);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Auth guard: open modal if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal('login');
    }
  }, [authLoading, user, openAuthModal]);

  // Payment status polling
  useEffect(() => {
    if (!isSuccess || !createdJobId || paymentConfirmed) return;

    const POLL_INTERVAL = 5000;
    const MAX_DURATION = 10 * 60 * 1000;
    const startTime = Date.now();

    const intervalId = setInterval(async () => {
      if (Date.now() - startTime > MAX_DURATION) {
        clearInterval(intervalId);
        return;
      }
      try {
        const res = await apiFetch<{ status: string; paidAt: string | null; expiresAt: string | null }>(
          `/jobs/${createdJobId}/payment-status`,
        );
        if (res.data.status === 'ACTIVE') {
          setPaymentConfirmed(true);
          clearInterval(intervalId);
          toast.success("Pagamento confirmado! Sua vaga está ativa.");
        }
      } catch {
        // silent — keep polling
      }
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isSuccess, createdJobId, paymentConfirmed]);

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: formatWhatsApp(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: keyof CreateJobFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O banner deve ter no máximo 5MB.");
        return;
      }
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerFile) {
      toast.error("O banner da vaga é obrigatório.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("banner", bannerFile);
      payload.append("title", formData.title);
      payload.append("companyName", formData.companyName);
      payload.append("email", formData.email);
      payload.append("responsibleName", formData.responsibleName);
      payload.append("whatsapp", formData.whatsapp);
      payload.append("city", formData.city);
      payload.append("type", formData.type);
      payload.append("description", formData.description);
      payload.append("requirements", formData.requirements);
      payload.append("plan", formData.plan);

      if (formData.salary) payload.append("salary", formData.salary);
      if (formData.benefits) payload.append("benefits", formData.benefits);
      if (formData.applicationLink) payload.append("applicationLink", formData.applicationLink);

      const res = await apiFetch<any>("/jobs", {
        method: "POST",
        body: payload,
      });

      setPixData(res.data.payment);
      setCreatedJobId(res.data.job.id);
      setIsSuccess(true);
      toast.success("Vaga criada com sucesso! Realize o pagamento para ativá-la.");
    } catch (error: any) {
      if (error.errors) {
        Object.values(error.errors).forEach((errMsgs: any) => {
          if (Array.isArray(errMsgs)) {
            errMsgs.forEach(msg => toast.error(msg));
          } else {
            toast.error(errMsgs as string);
          }
        });
      } else {
        toast.error(error.message || "Erro ao publicar vaga.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not authenticated fallback
  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardContent className="py-12">
          <p className="text-muted-foreground mb-4">
            Você precisa estar logado para publicar uma vaga.
          </p>
          <Button onClick={() => openAuthModal('login')}>Entrar / Cadastrar</Button>
        </CardContent>
      </Card>
    );
  }

  // Payment confirmed screen
  if (isSuccess && paymentConfirmed) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Vaga ativada com sucesso!
          </h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Seu pagamento foi confirmado e a vaga já está publicada no portal.
          </p>
          <Button className="w-full max-w-sm" onClick={() => router.push("/minhas-vagas")}>
            Ver Minhas Vagas
          </Button>
        </CardContent>
      </Card>
    );
  }

  // QR code waiting screen
  if (isSuccess && pixData) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Vaga cadastrada com sucesso!
          </h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Sua vaga foi salva. Para que ela seja publicada e divulgada, por favor, realize o pagamento via PIX.
          </p>

          <div className="bg-muted p-6 rounded-lg w-full max-w-sm flex flex-col items-center gap-4">
            <h3 className="font-semibold text-lg">Pagar com PIX</h3>
            {pixData.qrCodeBase64 && (
              <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48" />
            )}
            <div className="w-full">
              <Label className="text-xs">Código PIX Copia e Cola</Label>
              <Input value={pixData.qrCode} readOnly className="text-xs mt-1" />
              <Button
                className="w-full mt-2"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(pixData.qrCode);
                  toast.success("Código PIX copiado!");
                }}
              >
                Copiar Código
              </Button>
            </div>
            {pixData.ticket_url && (
              <Button asChild variant="link" className="w-full">
                <a href={pixData.ticket_url} target="_blank" rel="noopener noreferrer">
                  Ver recibo do Mercado Pago
                </a>
              </Button>
            )}
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aguardando confirmação do pagamento...
          </p>

          <Button className="mt-4 w-full max-w-sm" variant="ghost" onClick={() => router.push("/minhas-vagas")}>
            Ir para Minhas Vagas
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Cadastrar Nova Vaga</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para publicar sua vaga.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Crown className="h-5 w-5 text-accent" />
              Plano da Vaga
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className={`cursor-pointer transition-all ${formData.plan === 'BASIC' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                onClick={() => setFormData({ ...formData, plan: 'BASIC' })}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">Plano Básico - R$ 20</h4>
                  <p className="text-sm text-muted-foreground">Publicação padrão no site e no grupo do WhatsApp.</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all ${formData.plan === 'PRO' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                onClick={() => setFormData({ ...formData, plan: 'PRO' })}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-2">Plano PRO - R$ 30</h4>
                  <p className="text-sm text-muted-foreground">Destaque na página inicial e topo da lista do WhatsApp.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ImageIcon className="h-5 w-5 text-accent" />
              Banner da Vaga *
            </h3>
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {bannerPreview ? (
                <div className="relative w-full h-48">
                  <Image src={bannerPreview} alt="Preview do Banner" fill className="object-contain rounded-md" />
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Clique para fazer upload da imagem (Max: 5MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building2 className="h-5 w-5 text-accent" />
              Dados da Empresa
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Ex: TechPatos Soluções"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleName">Nome do Responsável *</Label>
                <Input
                  id="responsibleName"
                  name="responsibleName"
                  placeholder="Seu nome"
                  value={formData.responsibleName}
                  onChange={handleInputChange}
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="(83) 99999-9999"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Briefcase className="h-5 w-5 text-accent" />
              Dados da Vaga
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Vaga *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  minLength={5}
                  maxLength={150}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Patos-PB"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="mb-2.5">Tipo da Vaga</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {jobTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Faixa Salarial (opcional)</Label>
                <Input
                  id="salary"
                  name="salary"
                  placeholder="Ex: R$ 2.000 - R$ 3.500"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="h-5 w-5 text-accent" />
              Detalhes da Vaga
            </h3>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva as atividades e responsabilidades da vaga..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                minLength={30}
                maxLength={5000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requisitos *</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Conhecimentos e experiências necessárias..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                required
                minLength={10}
                maxLength={3000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefícios (opcional)</Label>
              <Textarea
                id="benefits"
                name="benefits"
                placeholder="Vale alimentação, plano de saúde, etc..."
                value={formData.benefits}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationLink">Link para Candidatura (opcional)</Label>
              <Input
                id="applicationLink"
                name="applicationLink"
                type="url"
                placeholder="https://..."
                value={formData.applicationLink}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                "Publicar Vaga e Gerar PIX"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
