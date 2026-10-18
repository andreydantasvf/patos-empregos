# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# pnpm na versão fixada no campo packageManager do package.json
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia o código fonte, incluindo o .env, se existir: as variáveis NEXT_PUBLIC_*
# são embutidas no bundle durante o build.
COPY . .

# URLs vistas pelo navegador. O Next não deixa o .env sobrescrever variáveis que
# já estão no ambiente, então estes args (definidos no docker-compose.yml)
# vencem os valores do .env; as demais NEXT_PUBLIC_* continuam vindo dele.
ARG NEXT_PUBLIC_API_URL=http://localhost:3333
ARG NEXT_PUBLIC_SITE_URL=http://localhost:5173
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# --- Production Stage ---
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./

EXPOSE 5173

CMD ["pnpm", "start", "-p", "5173"]
