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
  private readonly categoriaRepository = new CategoriaRepository(prisma);
  private readonly produtoRepository = new ProdutoRepository(prisma);
  private readonly movimentacaoRepository = new MovimentacaoRepository(prisma);

  private readonly categoriaService = new CategoriaService(this.categoriaRepository);
  private readonly produtoService = new ProdutoService(
    this.produtoRepository,
    this.categoriaRepository
  );
  private readonly movimentacaoService = new MovimentacaoService(
    this.movimentacaoRepository,
    this.produtoRepository
  );

  readonly categoriaController = new CategoriaController(this.categoriaService);
  readonly produtoController = new ProdutoController(this.produtoService);
  readonly movimentacaoController = new MovimentacaoController(this.movimentacaoService);
}

export const container = new Container();
