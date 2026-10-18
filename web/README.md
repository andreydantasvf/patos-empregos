# Patos Empregos — Web

Front-end da plataforma Patos Empregos (Next.js 16, React 19 e Tailwind CSS).

Visão geral, variáveis de ambiente e como rodar com Docker estão no [README da raiz](../README.md).

## Desenvolvimento local

Pré-requisitos: Node.js 22+, pnpm 10 e a API rodando (veja [`api/`](../api)).

```bash
cp .env.example .env.local
pnpm install
pnpm dev   # http://localhost:5173
```

As variáveis `NEXT_PUBLIC_*` são embutidas no build: depois de alterá-las, rode `pnpm build` de novo.
