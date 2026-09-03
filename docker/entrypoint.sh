#!/bin/sh
# =============================================================================
# ENTRYPOINT - Script de inicialização do container da API
# =============================================================================
# Aguarda o PostgreSQL ficar disponível, executa as migrations e inicia a API
# =============================================================================

set -e

echo "Aguardando banco de dados..."
sleep 5

echo "Executando migrations..."
npx prisma migrate deploy

echo "Iniciando API..."
exec node dist/server.js
