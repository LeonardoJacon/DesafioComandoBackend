# =============================================================================
# DOCKERFILE - Imagem da API
# =============================================================================
# Multi-stage build: primeiro compila o TypeScript, depois roda em produção
# =============================================================================

# --- Estágio 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências primeiro (cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Gera o Prisma Client
RUN npx prisma generate

# Copia o código fonte e compila
COPY tsconfig.json ./
COPY src ./src/

RUN npm run build

# --- Estágio 2: Produção ---
FROM node:20-alpine AS production

WORKDIR /app

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia Prisma schema e gera client
COPY prisma ./prisma/
RUN npx prisma generate

# Copia o código compilado do estágio anterior
COPY --from=builder /app/dist ./dist

# Script de inicialização: aguarda o banco, roda migrations e inicia a API
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
