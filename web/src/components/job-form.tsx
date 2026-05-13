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
import type { JobFormData, JobType, WorkMode } from "@/lib/types";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  CheckSquare,
  DollarSign,
  FileText,
  Gift,
  Link2,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const jobTypes: JobType[] = [
  "CLT",
  "PJ",
  "Estágio",
  "Temporário",
  "Freelancer",
];
const workModes: WorkMode[] = ["Presencial", "Remoto", "Híbrido"];

const initialFormData: JobFormData = {
  companyName: "",
  responsibleName: "",
  whatsapp: "",
  position: "",
  city: "Patos-PB",
  type: "CLT",
  workMode: "Presencial",
  salaryRange: "",
  description: "",
  requirements: "",
  benefits: "",
  applicationLink: "",
};

export function JobForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormData, string>>
  >({});

  const formatWhatsApp = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // Format as (XX) XXXXX-XXXX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
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

    // Clear error when user starts typing
    if (errors[name as keyof JobFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Nome da empresa é obrigatório";
    }

    if (!formData.responsibleName.trim()) {
      newErrors.responsibleName = "Nome do responsável é obrigatório";
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      newErrors.whatsapp = "WhatsApp inválido";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Cargo é obrigatório";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    } else if (formData.description.length < 20) {
      newErrors.description = "Descrição muito curta (mínimo 20 caracteres)";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requisitos são obrigatórios";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Redirect after success
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  if (isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Vaga cadastrada com sucesso!
          </h2>
          <p className="mb-6 max-w-md text-muted-foreground">
            Sua vaga foi enviada para análise. Após aprovação, ela será
            publicada no site e divulgada em nossos grupos de WhatsApp.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecionando para a página inicial...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Cadastrar Nova Vaga</CardTitle>
        <CardDescription>
          Preencha as informações abaixo para publicar sua vaga. É rápido e
          gratuito!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleName">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Nome do Responsável *
                  </span>
                </Label>
                <Input
                  id="responsibleName"
                  name="responsibleName"
                  placeholder="Seu nome"
                  value={formData.responsibleName}
                  onChange={handleInputChange}
                  className={errors.responsibleName ? "border-destructive" : ""}
                />
                {errors.responsibleName && (
                  <p className="text-sm text-destructive">
                    {errors.responsibleName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  WhatsApp *
                </span>
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="(83) 99999-9999"
                value={formData.whatsapp}
                onChange={handleInputChange}
                maxLength={16}
                className={errors.whatsapp ? "border-destructive" : ""}
              />
              {errors.whatsapp && (
                <p className="text-sm text-destructive">{errors.whatsapp}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Briefcase className="h-5 w-5 text-accent" />
              Dados da Vaga
            </h3>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Input
                id="position"
                name="position"
                placeholder="Ex: Desenvolvedor Full Stack"
                value={formData.position}
                onChange={handleInputChange}
                className={errors.position ? "border-destructive" : ""}
              />
              {errors.position && (
                <p className="text-sm text-destructive">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Cidade *
                </span>
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="Patos-PB"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
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
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="mb-2.5">Modalidade</Label>
                <Select
                  value={formData.workMode}
                  onValueChange={(value) =>
                    handleSelectChange("workMode", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workModes.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Faixa Salarial (opcional)
                </span>
              </Label>
              <Input
                id="salaryRange"
                name="salaryRange"
                placeholder="Ex: R$ 2.000 - R$ 3.500"
                value={formData.salaryRange}
                onChange={handleInputChange}
              />
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
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">
                <span className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  Requisitos *
                </span>
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Conhecimentos e experiências necessárias..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className={errors.requirements ? "border-destructive" : ""}
              />
              {errors.requirements && (
                <p className="text-sm text-destructive">
                  {errors.requirements}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">
                <span className="flex items-center gap-1">
                  <Gift className="h-4 w-4" />
                  Benefícios (opcional)
                </span>
              </Label>
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
              <Label htmlFor="applicationLink">
                <span className="flex items-center gap-1">
                  <Link2 className="h-4 w-4" />
                  Link para Candidatura (opcional)
                </span>
              </Label>
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
                  Enviando...
                </>
              ) : (
                "Publicar Vaga"
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Sua vaga será analisada antes de ser publicada. Isso geralmente
              leva até 24 horas.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
