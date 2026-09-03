// =============================================================================
// SERVICE DE PRODUTOS
// =============================================================================

import { AppError } from "../errors/AppError";
import { ICategoriaRepository } from "../repositories/interfaces/ICategoriaRepository";
import { IProdutoRepository } from "../repositories/interfaces/IProdutoRepository";
import {
  CreateProdutoInput,
  UpdateProdutoInput,
  PaginationQuery,
} from "../schemas/produto.schema";

export class ProdutoService {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly categoriaRepository: ICategoriaRepository
  ) {}

  async criar(data: CreateProdutoInput) {
    // Regra: SKU deve ser único
    const skuExistente = await this.produtoRepository.findBySku(data.sku);
    if (skuExistente) {
      throw new AppError(`Já existe um produto com o SKU "${data.sku}"`, 409);
    }

    // Verifica se a categoria informada existe
    const categoria = await this.categoriaRepository.findById(data.categoriaId);
    if (!categoria) {
      throw new AppError("Categoria informada não existe", 404);
    }

    // Estoque inicial é sempre 0 (definido no schema Prisma, não aceito no body)
    return this.produtoRepository.create(data);
  }

  async listar(pagination: PaginationQuery) {
    return this.produtoRepository.findAllPaginated(pagination);
  }

  async buscarPorId(id: string) {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }
    return produto;
  }

  async atualizar(id: string, data: UpdateProdutoInput) {
    await this.buscarPorId(id);

    // Se está trocando a categoria, valida se a nova existe
    if (data.categoriaId) {
      const categoria = await this.categoriaRepository.findById(data.categoriaId);
      if (!categoria) {
        throw new AppError("Categoria informada não existe", 404);
      }
    }

    // Regra: quantidade_estoque NÃO pode ser atualizada por aqui
    return this.produtoRepository.update(id, data);
  }

  async deletar(id: string) {
    await this.buscarPorId(id);
    await this.produtoRepository.delete(id);
  }
}
