import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./database/prisma";

const app = createApp();

async function bootstrap() {
  try {
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

process.on("SIGTERM", async () => {
  console.log("Encerrando aplicação...");
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
