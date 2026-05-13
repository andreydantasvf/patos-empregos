import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Patos Empregos | Vagas de Emprego em Patos-PB",
  description:
    "Encontre as melhores oportunidades de emprego em Patos-PB. Vagas locais de empresas da região, divulgação rápida e gratuita. Conectando candidatos e empresas em Patos, Paraíba.",
  keywords: [
    "empregos em Patos",
    "vagas em Patos PB",
    "trabalho em Patos",
    "emprego Patos Paraíba",
    "vagas de emprego Patos",
    "oportunidades de trabalho Patos PB",
    "emprego na Paraíba",
    "vagas Patos sertão",
  ],
  authors: [{ name: "Genesis Web" }],
  creator: "Genesis Web",
  publisher: "Patos Empregos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://patosempregos.com.br",
    siteName: "Patos Empregos",
    title: "Patos Empregos | Vagas de Emprego em Patos-PB",
    description:
      "Encontre as melhores oportunidades de emprego em Patos-PB. Vagas locais de empresas da região.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patos Empregos | Vagas de Emprego em Patos-PB",
    description: "Encontre as melhores oportunidades de emprego em Patos-PB.",
  },
  icons: {
    icon: [
      {
        url: "/menor-no-bg-apenas-logo-patos-empregos.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/menor-no-bg-apenas-logo-patos-empregos.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/menor-no-bg-apenas-logo-patos-empregos.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/menor-no-bg-apenas-logo-patos-empregos.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD700",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
