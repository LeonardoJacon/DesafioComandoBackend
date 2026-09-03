// =============================================================================
// CONTAINER DE INJEÇÃO DE DEPENDÊNCIAS (DI)
// =============================================================================
// Monta manualmente o grafo de dependências da aplicação:
// Prisma → Repositories → Services → Controllers
//
// Benefícios:
// - Cada camada depende de INTERFACES, não de implementações concretas
// - Facilita testes (pode injetar mocks)
// - Centraliza a criação de instâncias em um único lugar
// =============================================================================

import { prisma } from "../database/prisma";
import { CategoriaRepository } from "../repositories/prisma/CategoriaRepository";
import { ProdutoRepository } from "../repositories/prisma/ProdutoRepository";
import { MovimentacaoRepository } from "../repositories/prisma/MovimentacaoRepository";
import { CategoriaService } from "../services/CategoriaService";
import { ProdutoService } from "../services/ProdutoService";
import { MovimentacaoService } from "../services/MovimentacaoService";
import { CategoriaController } from "../controllers/CategoriaController";
import { ProdutoController } from "../controllers/ProdutoController";
import { MovimentacaoController } from "../controllers/MovimentacaoController";

export class Container {
  // Repositories
  private readonly categoriaRepository = new CategoriaRepository(prisma);
  private readonly produtoRepository = new ProdutoRepository(prisma);
  private readonly movimentacaoRepository = new MovimentacaoRepository(prisma);

  // Services (recebem repositories via construtor)
  private readonly categoriaService = new CategoriaService(this.categoriaRepository);
  private readonly produtoService = new ProdutoService(
    this.produtoRepository,
    this.categoriaRepository
  );
  private readonly movimentacaoService = new MovimentacaoService(
    this.movimentacaoRepository,
    this.produtoRepository
  );

  // Controllers (recebem services via construtor)
  readonly categoriaController = new CategoriaController(this.categoriaService);
  readonly produtoController = new ProdutoController(this.produtoService);
  readonly movimentacaoController = new MovimentacaoController(this.movimentacaoService);
}

/** Instância singleton do container — usada em toda a aplicação */
export const container = new Container();
