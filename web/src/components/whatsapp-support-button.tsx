"use client";

import Image from "next/image";

const SUPPORT_URL = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL;

export function WhatsAppSupportButton() {
  if (!SUPPORT_URL) return null;

  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      aria-label="Tirar dúvidas pelo WhatsApp"
    >
      <Image
        src="/whatsapp-svgrepo-com.svg"
        loading="eager"
        alt="WhatsApp"
        width={22}
        height={22}
        className="invert"
      />
      <span className="hidden sm:inline">Tirar dúvidas</span>
    </a>
  );
}
