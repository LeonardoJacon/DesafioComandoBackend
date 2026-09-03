// =============================================================================
// PONTO DE ENTRADA DA APLICAÇÃO (SERVER)
// =============================================================================
// Inicia o servidor HTTP na porta configurada nas variáveis de ambiente.
// =============================================================================

import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./database/prisma";

const app = createApp();

async function bootstrap() {
  try {
    // Testa a conexão com o banco antes de subir o servidor
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados PostgreSQL");

    app.listen(env.port, () => {
      console.log(`🚀 API rodando em http://localhost:${env.port}`);
      console.log(`📋 Health check: http://localhost:${env.port}/health`);
    });
  } catch (error) {
    console.error("❌ Falha ao iniciar a aplicação:", error);
    process.exit(1);
  }
}

// Encerra conexões gracefully ao receber SIGTERM (ex: docker stop)
process.on("SIGTERM", async () => {
  console.log("Encerrando aplicação...");
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
