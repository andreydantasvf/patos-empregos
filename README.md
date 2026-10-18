# Patos Empregos

Plataforma regional de vagas de emprego de Patos-PB. Empresas se cadastram, publicam vagas e pagam via PIX pelo Mercado Pago. Assim que o pagamento é confirmado, a vaga entra no site e é divulgada automaticamente em um grupo do WhatsApp. Os candidatos navegam e filtram as vagas sem precisar de conta. Um painel administrativo modera vagas e empresas e publica vagas gratuitas.

## Estrutura

Monorepo com a API e o front-end em pastas separadas:

| Pasta | Descrição | Stack |
| --- | --- | --- |
| [`api/`](api) | API REST | Node.js, Express, TypeScript, Prisma 7, PostgreSQL, Zod, JWT, Mercado Pago, Cloudinary, Evolution API (WhatsApp), node-cron |
| [`web/`](web) | Aplicação web | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, React Hook Form, Zod |

Cada pasta é um projeto independente, com seu próprio `package.json`, lockfile e `.env.example`. O `docker-compose.yml` da raiz sobe o banco, a API e o front-end juntos.

## Funcionalidades

- **Planos pagos via PIX**: Básico (R$ 19,90, 7 dias) e Destaque (R$ 34,90, 15 dias, com prioridade na listagem). A vaga só é ativada quando o webhook do Mercado Pago confirma o pagamento, com validação da assinatura HMAC.
- **Divulgação no WhatsApp**: ao ser ativada, a vaga é enviada ao grupo pela Evolution API, com imagem e link. Rotinas agendadas repostam as vagas ainda abertas (Destaque a cada ~3 dias, Básico uma vez na metade do prazo).
- **Expiração automática**: tarefas com `node-cron` expiram vagas vencidas e pagamentos PIX não concluídos.
- **Painel administrativo**: moderação (suspender, reativar, remover), bloqueio de empresas, publicação de vagas gratuitas e repost manual.
- **SEO**: páginas de vaga renderizadas no servidor com metadados e JSON-LD `JobPosting`, além de `sitemap.xml` e `robots.txt` gerados.
- **Segurança da API**: Helmet, CORS configurável, rate limit geral e mais restrito no login, senhas com bcrypt e validação de todas as entradas com Zod.

## Módulos da API

`auth` · `jobs` · `payments` · `empresa` · `admin`

| Rota | Descrição |
| --- | --- |
| `POST /auth/register`, `POST /auth/login` | Cadastro e login da empresa |
| `POST /auth/admin/login` | Login do administrador |
| `GET /jobs`, `GET /jobs/:id` | Listagem pública (filtros e paginação) e detalhe da vaga |
| `POST /jobs`, `GET /jobs/me`, `POST /jobs/:id/renovar` | Publicação (com imagem), vagas da empresa e renovação |
| `GET /payments/:jobId/status`, `POST /payments/webhook/mercadopago` | Status do PIX e webhook do Mercado Pago |
| `GET /empresa/perfil`, `PATCH /empresa/perfil` | Perfil da empresa |
| `/admin/*` | Vagas, empresas e configurações (somente administrador) |
| `GET /health` | Health check |

## Como rodar

### Rodar com Docker

Pré-requisitos: Docker com Compose v2.

```bash
cp api/.env.example api/.env
docker compose up --build
```

O `api/.env.example` já funciona sem edição. Na subida, a API aplica as migrações e cria o administrador do seed.

| Serviço | URL |
| --- | --- |
| Web | `http://localhost:5173` |
| API | `http://localhost:3333` |
| PostgreSQL | `localhost:5432` |

As portas ficam expostas somente em `localhost`. O painel administrativo fica em `http://localhost:5173/admin/login`, com `ADMIN_EMAIL` e `ADMIN_PASSWORD` do `api/.env` (por padrão, `admin@patosempregos.com.br` / `admin123`).

Para parar, use `docker compose down` (os dados do banco continuam no volume). Para apagar também os dados, use `docker compose down -v`.

#### Integrações

Cloudinary, Mercado Pago e Evolution API são opcionais fora de produção. Sem as chaves, a API sobe normalmente e só a funcionalidade correspondente responde `503`:

| Sem a chave de | Fica indisponível |
| --- | --- |
| Cloudinary | Publicar vaga (a imagem é obrigatória) |
| Mercado Pago | Gerar o PIX e confirmar o pagamento |
| Evolution API | Enviar vagas ao grupo do WhatsApp |

Para usá-las, preencha as chaves no `api/.env` e reinicie a API (`docker compose up -d api`). Com `NODE_ENV=production`, a API se recusa a iniciar sem elas.

O pagamento só é confirmado quando o Mercado Pago chama `POST /payments/webhook/mercadopago`, o que exige uma URL pública. Para testar o PIX localmente, exponha a API com um túnel (por exemplo, `ngrok http 3333`), cadastre `https://<subdominio>/payments/webhook/mercadopago` como webhook no painel do Mercado Pago e coloque a assinatura secreta em `MERCADO_PAGO_WEBHOOK_SECRET`.

#### Variáveis no Docker

O Compose sobrescreve algumas variáveis do `api/.env` para a rede interna: `DATABASE_URL` aponta para o serviço `database`, e `APP_URL`/`CORS_ORIGIN` para `http://localhost:5173`. As credenciais do banco são `postgres`/`postgres`, e o banco é `patos_empregos`. Para mudá-las, defina `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` em um `.env` na raiz antes da primeira subida (mudanças posteriores não alteram um volume existente).

No front-end, as variáveis `NEXT_PUBLIC_*` são embutidas no build. O Compose define `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_SITE_URL`. Os links opcionais do WhatsApp podem ir em um `web/.env` (veja `web/.env.example`). Depois de alterá-lo, reconstrua a imagem com `docker compose up --build`.

### Rodar sem Docker

Pré-requisitos: Node.js 22+, [pnpm](https://pnpm.io/) 10 (fixado no campo `packageManager`; com o Corepack ativo, `corepack enable` já usa a versão certa) e um PostgreSQL. O banco pode vir do próprio Compose:

```bash
docker compose up -d database
```

#### API (`http://localhost:3333`)

```bash
cd api
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
pnpm dev
```

#### Web (`http://localhost:5173`)

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
```

## Variáveis de ambiente

**API** (`api/.env`)

| Variável | Uso |
| --- | --- |
| `PORT`, `NODE_ENV` | Aplicação |
| `DATABASE_URL` | PostgreSQL |
| `APP_URL` | URL do front-end, usada nos links das vagas enviadas ao WhatsApp |
| `CORS_ORIGIN` | Origens permitidas (`*` ou lista separada por vírgula) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Assinatura e validade dos tokens |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrador criado pelo seed |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | Upload da imagem da vaga |
| `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_WEBHOOK_SECRET` | Pagamento PIX |
| `EVOLUTION_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`, `WHATSAPP_GROUP_ID` | Divulgação no WhatsApp |

**Web** (`web/.env.local`)

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL da API usada pelo navegador |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (SEO, Open Graph e sitemap) |
| `API_INTERNAL_URL` | Opcional: URL da API usada pelo servidor do Next, quando difere da pública (no Compose, `http://api:3333`) |
| `NEXT_PUBLIC_WHATSAPP_URL` | Opcional: convite do grupo de vagas no WhatsApp |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP_URL` | Opcional: link de suporte no WhatsApp |

## Histórico

Este repositório une os antigos repositórios `patos-empregos-backend` e `patos-empregos-frontend`, com o histórico de commits de ambos preservado em `api/` e `web/`.
