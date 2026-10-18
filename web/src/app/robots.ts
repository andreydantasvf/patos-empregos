import { DEMO_MODE, SITE_URL } from "@/lib/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // A demo só tem vagas fictícias: nada deve ser indexado
  if (DEMO_MODE) return { rules: [{ userAgent: "*", disallow: "/" }] };

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/minhas-vagas", "/empresa/", "/pagamento/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
