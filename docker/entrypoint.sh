#!/bin/sh

set -e

echo "Aguardando banco de dados..."
sleep 5

echo "Executando migrations..."
npx prisma migrate deploy

echo "Iniciando API..."
exec node dist/server.js
