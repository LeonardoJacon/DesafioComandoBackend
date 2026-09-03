// =============================================================================
// SERVICE DE MOVIMENTAÇÕES
// =============================================================================
// Responsável pelas regras de estoque: entrada aumenta, saída diminui,
// bloqueia saída sem saldo e reverte ao cancelar.
// =============================================================================

import { TipoMovimentacao } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { IProdutoRepository } from "../repositories/interfaces/IProdutoRepository";
import { IMovimentacaoRepository } from "../repositories/interfaces/IMovimentacaoRepository";
import { CreateMovimentacaoInput } from "../schemas/movimentacao.schema";

export class MovimentacaoService {
  constructor(
    private readonly movimentacaoRepository: IMovimentacaoRepository,
    private readonly produtoRepository: IProdutoRepository
  ) {}

  /**
   * Calcula o novo estoque com base no tipo e quantidade da movimentação.
   * Para cancelamento, inverte a lógica (reverte o impacto).
   */
  private calcularNovoEstoque(
    estoqueAtual: number,
    tipo: TipoMovimentacao,
    quantidade: number,
    reverter: boolean = false
  ): number {
    if (reverter) {
      // Ao cancelar: ENTRADA vira saída e SAIDA vira entrada
      return tipo === "ENTRADA"
        ? estoqueAtual - quantidade
        : estoqueAtual + quantidade;
    }

    return tipo === "ENTRADA"
      ? estoqueAtual + quantidade
      : estoqueAtual - quantidade;
  }

  async registrar(data: CreateMovimentacaoInput) {
    const produto = await this.produtoRepository.findByIdSimple(data.produtoId);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    const novoEstoque = this.calcularNovoEstoque(
      produto.quantidadeEstoque,
      data.tipo as TipoMovimentacao,
      data.quantidade
    );

    // Regra: bloquear saída se quantidade for maior que o saldo
    if (data.tipo === "SAIDA" && novoEstoque < 0) {
      throw new AppError(
        `Estoque insuficiente. Saldo atual: ${produto.quantidadeEstoque}, solicitado: ${data.quantidade}`,
        400
      );
    }

    // Regra: atualizar estoque do produto (via transação atômica)
    return this.movimentacaoRepository.createWithEstoqueUpdate(
      {
        tipo: data.tipo as TipoMovimentacao,
        quantidade: data.quantidade,
        observacao: data.observacao,
        produtoId: data.produtoId,
      },
      novoEstoque
    );
  }

  async listar() {
    return this.movimentacaoRepository.findAll();
  }

  async listarPorProduto(produtoId: string) {
    const produto = await this.produtoRepository.findByIdSimple(produtoId);
    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    return this.movimentacaoRepository.findByProdutoId(produtoId);
  }

  async cancelar(id: string) {
    const movimentacao = await this.movimentacaoRepository.findById(id);
    if (!movimentacao) {
      throw new AppError("Movimentação não encontrada", 404);
    }

    if (movimentacao.cancelada) {
      throw new AppError("Esta movimentação já foi cancelada", 400);
    }

    const produto = await this.produtoRepository.findByIdSimple(movimentacao.produtoId);
    if (!produto) {
      throw new AppError("Produto vinculado não encontrado", 404);
    }

    // Calcula o estoque revertido (inverte o efeito da movimentação original)
    const novoEstoque = this.calcularNovoEstoque(
      produto.quantidadeEstoque,
      movimentacao.tipo,
      movimentacao.quantidade,
      true // reverter = true
    );

    // Ao cancelar uma ENTRADA, o estoque diminui — validar se não fica negativo
    if (novoEstoque < 0) {
      throw new AppError(
        "Não é possível cancelar esta movimentação: o estoque ficaria negativo.",
        400
      );
    }

    // Regra: ao cancelar, reverter o impacto no estoque (transação atômica)
    return this.movimentacaoRepository.cancelarWithEstoqueRevert(id, novoEstoque);
  }
}
