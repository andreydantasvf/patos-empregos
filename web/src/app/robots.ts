import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/minhas-vagas", "/empresa/", "/pagamento/"],
      },
    ],
    sitemap: "https://patosempregos.com.br/sitemap.xml",
  };
}
