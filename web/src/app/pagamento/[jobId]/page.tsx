"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import type { PaymentStatusDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  ticketUrl: string;
  amount: number;
}

const pixStorageKey = (jobId: string) => `pix_data_${jobId}`;

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const { user, isLoading: authLoading } = useAuth();

  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!jobId) return;
    const stored = localStorage.getItem(pixStorageKey(jobId));
    if (stored) {
      try {
        setPixData(JSON.parse(stored));
      } catch {
        // ignore malformed data
      }
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId || isConfirmed) return;

    const MAX_DURATION = 10 * 60 * 1000;
    const startTime = Date.now();

    const intervalId = setInterval(async () => {
      if (Date.now() - startTime > MAX_DURATION) {
        clearInterval(intervalId);
        return;
      }
      try {
        const res = await apiFetch<PaymentStatusDto>(`/payments/${jobId}/status`);
        if (res.data.status === "CONFIRMED") {
          setIsConfirmed(true);
          clearInterval(intervalId);
          localStorage.removeItem(pixStorageKey(jobId));
          toast.success("Pagamento confirmado! Sua vaga está ativa.");
          setTimeout(() => router.push("/minhas-vagas"), 2000);
        }
      } catch {
        // silent — keep polling
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [jobId, isConfirmed, router]);

  if (authLoading || !user) return null;

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Vaga ativada!</h2>
            <p className="text-muted-foreground">
              Redirecionando para suas vagas...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <h2 className="mb-2 text-2xl font-bold">Pagamento via PIX</h2>
          <p className="mb-6 text-muted-foreground">
            Realize o pagamento abaixo para ativar sua vaga.
          </p>

          {pixData ? (
            <div className="w-full space-y-4">
              {pixData.qrCodeBase64 && (
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="h-48 w-48"
                  />
                </div>
              )}
              {pixData.amount && (
                <p className="text-lg font-semibold">
                  Valor: R${" "}
                  {pixData.amount.toFixed(2).replace(".", ",")}
                </p>
              )}
              <div className="space-y-1 text-left">
                <Label className="text-xs">Código PIX Copia e Cola</Label>
                <Input value={pixData.qrCode} readOnly className="text-xs" />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.qrCode);
                    toast.success("Código PIX copiado!");
                  }}
                >
                  Copiar código
                </Button>
              </div>
              {pixData.ticketUrl && (
                <Button asChild variant="link" className="w-full">
                  <a
                    href={pixData.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir página do Mercado Pago
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <Clock className="mx-auto mb-2 h-8 w-8" />
              <p>
                Pagamento pendente. Se já realizou o PIX, aguarde a confirmação
                automática.
              </p>
            </div>
          )}

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aguardando confirmação do pagamento...
          </p>

          <Button asChild variant="ghost" className="mt-4 w-full">
            <Link href="/minhas-vagas">Ir para Minhas Vagas</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
