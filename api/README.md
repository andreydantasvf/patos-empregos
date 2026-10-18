# Patos Empregos — API

API REST da plataforma Patos Empregos (Express, TypeScript, Prisma e PostgreSQL).

Visão geral, rotas, variáveis de ambiente e como rodar com Docker estão no [README da raiz](../README.md).

## Desenvolvimento local

Pré-requisitos: Node.js 22+, pnpm 10 e um PostgreSQL (`docker compose up -d database`, na raiz do repositório).

```bash
cp .env.example .env
pnpm install
pnpm prisma:generate   # gera o Prisma Client em src/generated
pnpm prisma:migrate    # aplica as migrações
pnpm seed              # cria o administrador (ADMIN_EMAIL / ADMIN_PASSWORD)
pnpm dev               # http://localhost:3333
```

## Scripts

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Servidor com recarga automática |
| `pnpm build` / `pnpm start` | Build TypeScript e execução do build |
| `pnpm prisma:migrate` | Cria e aplica migrações em desenvolvimento |
| `pnpm prisma:studio` | Interface do Prisma para o banco |
| `pnpm lint` / `pnpm format` | ESLint e Prettier |

## Imagem Docker

O `Dockerfile` gera a imagem de produção. Ao iniciar, o contêiner aplica as migrações (`prisma migrate deploy`), roda o seed do administrador e sobe a API na porta 3333.
