import { Button } from "@/components/ui/button";
import Image from "next/image";

export function WhatsAppBanner() {
  return (
    <section className="relative overflow-hidden bg-whatsapp py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Image src="/whatsapp-svgrepo-com.svg" alt="WhatsApp" width={40} height={40} className="invert" />
            </div>
          </div>

          <h2 className="mb-4 text-balance text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Receba vagas diretamente no WhatsApp
          </h2>

          <p className="mb-8 text-pretty text-lg text-white/90 md:text-xl">
            Entre no nosso grupo e seja o primeiro a saber das novas
            oportunidades de emprego em Patos-PB. É gratuito!
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white px-8 py-6 text-lg font-semibold text-whatsapp shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/whatsapp-svgrepo-com.svg" alt="WhatsApp" width={24} height={24} className="mr-3" />
              Entrar no Grupo do WhatsApp
            </a>
          </Button>

          {/* <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">+1.000 membros</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span className="text-sm">Vagas em tempo real</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
