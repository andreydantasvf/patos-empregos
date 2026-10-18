// URL pública do site (SEO, Open Graph, sitemap)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5173";

// URL da API usada pelo navegador
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

// URL da API usada pelo servidor do Next (páginas de vaga e sitemap). Só muda
// quando o servidor alcança a API por outro endereço, como dentro do Docker.
export const SERVER_API_URL = process.env.API_INTERNAL_URL ?? API_URL;
