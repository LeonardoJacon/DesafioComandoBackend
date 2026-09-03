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

  private calcularNovoEstoque(
    estoqueAtual: number,
    tipo: TipoMovimentacao,
    quantidade: number,
    reverter: boolean = false
  ): number {
    if (reverter) {
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

    if (data.tipo === "SAIDA" && novoEstoque < 0) {
      throw new AppError(
        `Estoque insuficiente. Saldo atual: ${produto.quantidadeEstoque}, solicitado: ${data.quantidade}`,
        400
      );
    }

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

    const novoEstoque = this.calcularNovoEstoque(
      produto.quantidadeEstoque,
      movimentacao.tipo,
      movimentacao.quantidade,
      true
    );

    if (novoEstoque < 0) {
      throw new AppError(
        "Não é possível cancelar esta movimentação: o estoque ficaria negativo.",
        400
      );
    }

    return this.movimentacaoRepository.cancelarWithEstoqueRevert(id, novoEstoque);
  }
}
