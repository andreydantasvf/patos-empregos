# Patos Empregos — API

API REST da plataforma regional de empregos Patos Empregos.

---

## Desenvolvimento local

### Pré-requisitos

- Node.js 20+
- pnpm
- Docker (para o banco de dados)

### Subir o banco de dados

```bash
docker compose up -d
```

### Instalar dependências

```bash
pnpm install
```

### Configurar variáveis de ambiente

Copie o `.env.example` e preencha com os valores corretos:

```bash
cp .env.example .env
```

### Rodar as migrations e o seed

```bash
pnpm prisma:migrate
pnpm prisma:seed
```

### Iniciar em modo desenvolvimento

```bash
pnpm dev
```

---

## Build e publicação no Docker Hub

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Conta no [Docker Hub](https://hub.docker.com)
- Buildx habilitado (já vem ativo por padrão no Docker Desktop para Mac)

### 1. Login no Docker Hub

```bash
docker login
```

### 2. Criar o builder multiplataforma (apenas na primeira vez)

```bash
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap
```

### 3. Gerar a imagem para Linux (amd64) e publicar

Substitua `<seu-usuario>` pelo seu nome de usuário no Docker Hub:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t techgenesisweb/api-patos-empregos:latest \
  --push \
  .
```

Para publicar uma versão específica junto com a `latest`:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t techgenesisweb/api-patos-empregos:1.0.0 \
  -t techgenesisweb/api-patos-empregos:latest \
  --push \
  .
```

> A flag `--push` envia a imagem diretamente para o Docker Hub durante o build.
> A flag `--platform linux/amd64` garante que a imagem seja compatível com servidores Linux,
> mesmo que você esteja construindo em um Mac com chip Apple Silicon (ARM).

### 4. Verificar a imagem publicada

```bash
docker buildx imagetools inspect techgenesisweb/api-patos-empregos:latest
```

---

## Rodando a imagem em produção

A API depende de um banco PostgreSQL. Configure as variáveis de ambiente no servidor e execute:

```bash
docker run -d \
  --name api-patos-empregos \
  -p 3333:3333 \
  --env-file .env \
  techgenesisweb/api-patos-empregos:latest
```

### Rodar as migrations em produção

Após subir o container pela primeira vez, execute as migrations:

```bash
docker exec -it api-patos-empregos npx prisma migrate deploy
```
