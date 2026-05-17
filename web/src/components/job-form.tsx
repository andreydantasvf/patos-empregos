"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import cargos from "@/assets/lista_cargos.json";
import {
  Briefcase,
  Check,
  ChevronsUpDown,
  Crown,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const jobTypes: { value: JobType; label: string }[] = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "INTERNSHIP", label: "Estágio" },
  { value: "TEMPORARY", label: "Temporário" },
  { value: "FREELANCER", label: "Freelancer" },
];

interface CreateJobFormValues {
  title: string;
  area: string;
  type: JobType;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  application_link: string;
  plan: JobPlan;
}

const initialFormData: CreateJobFormValues = {
  title: "",
  area: "",
  type: "CLT",
  salary: "",
  description: "",
  requirements: "",
  benefits: "",
  application_link: "",
  plan: "BASIC",
};

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function JobForm() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();

  const [formData, setFormData] = useState<CreateJobFormValues>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cargoOpen, setCargoOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal("login");
    }
  }, [authLoading, user, openAuthModal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof CreateJobFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("A imagem da vaga é obrigatória.");
      return;
    }

    if (!formData.area) {
      toast.error("Selecione o cargo da vaga.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("image", imageFile);
      payload.append("title", formData.title);
      payload.append("area", formData.area);
      payload.append("type", formData.type);
      payload.append("description", formData.description);
      payload.append("plan", formData.plan);

      if (formData.salary) payload.append("salary", formData.salary);
      if (formData.requirements)
        payload.append("requirements", formData.requirements);
      if (formData.benefits) payload.append("benefits", formData.benefits);
      if (formData.application_link)
        payload.append("application_link", formData.application_link);

      const res = await apiFetch<any>("/jobs", {
        method: "POST",
        body: payload,
      });

      const jobId = res.data.job.id;
      localStorage.setItem(`pix_data_${jobId}`, JSON.stringify(res.data.payment));

      toast.success("Vaga criada! Realize o pagamento para ativá-la.");
      router.push(`/pagamento/${jobId}`);
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
        toast.error(error.message || "Erro ao publicar vaga.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardContent className="py-12">
          <p className="text-muted-foreground mb-4">
            Você precisa estar logado para publicar uma vaga.
          </p>
          <Button onClick={() => openAuthModal("login")}>
            Entrar / Cadastrar
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
          {/* Plano */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Crown className="h-5 w-5 text-accent" />
              Plano da Vaga
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className={`cursor-pointer transition-all ${formData.plan === "BASIC" ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => setFormData({ ...formData, plan: "BASIC" })}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-1">Plano Básico</h4>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">R$39,90</span>
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">50% OFF</span>
                  </div>
                  <p className="text-xl font-bold text-secondary mb-1">R$19,90</p>
                  <p className="text-sm text-muted-foreground">
                    Publicação por 7 dias no site e no grupo do WhatsApp.
                  </p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all ${formData.plan === "FEATURED" ? "border-primary ring-2 ring-primary/20" : ""}`}
                onClick={() => setFormData({ ...formData, plan: "FEATURED" })}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg mb-1">Plano Destaque</h4>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground line-through">R$69,90</span>
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">50% OFF</span>
                  </div>
                  <p className="text-xl font-bold text-secondary mb-1">R$34,90</p>
                  <p className="text-sm text-muted-foreground">
                    15 dias + destaque no topo + repost automático a cada 5
                    dias.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Imagem */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ImageIcon className="h-5 w-5 text-accent" />
              Imagem da Vaga *
            </h3>
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-48">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Clique para fazer upload da imagem (Max: 5MB)
                  </p>
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

          {/* Dados da Vaga */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Briefcase className="h-5 w-5 text-accent" />
              Dados da Vaga
            </h3>

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
                maxLength={100}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Popover open={cargoOpen} onOpenChange={setCargoOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={cargoOpen}
                      className="w-full justify-between font-normal"
                    >
                      {formData.area
                        ? capitalize(formData.area)
                        : "Selecione o cargo..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar cargo..." />
                      <CommandList>
                        <CommandEmpty>Nenhum cargo encontrado.</CommandEmpty>
                        <CommandGroup>
                          {(cargos as string[]).map((cargo) => (
                            <CommandItem
                              key={cargo}
                              value={cargo}
                              onSelect={(value) => {
                                handleSelectChange("area", value);
                                setCargoOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${formData.area === cargo ? "opacity-100" : "opacity-0"}`}
                              />
                              {capitalize(cargo)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Tipo da Vaga</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          {/* Detalhes */}
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
                maxLength={3000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requisitos (opcional)</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Conhecimentos e experiências necessárias..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
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
              <Label htmlFor="application_link">
                Link / E-mail para Candidatura *
              </Label>
              <Input
                id="application_link"
                name="application_link"
                placeholder="https://... ou candidato@empresa.com"
                value={formData.application_link}
                onChange={handleInputChange}
                required
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
