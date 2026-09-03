// =============================================================================
// REPOSITÓRIO DE MOVIMENTAÇÕES (Implementação Prisma)
// =============================================================================
// Usa transações do Prisma para garantir atomicidade entre movimentação e estoque.
// =============================================================================

import { PrismaClient } from "@prisma/client";
import {
  IMovimentacaoRepository,
  CreateMovimentacaoData,
} from "../interfaces/IMovimentacaoRepository";

export class MovimentacaoRepository implements IMovimentacaoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private readonly includeProduto = { produto: true } as const;

  async create(data: CreateMovimentacaoData) {
    return this.prisma.movimentacao.create({
      data,
      include: this.includeProduto,
    });
  }

  async findAll() {
    return this.prisma.movimentacao.findMany({
      include: this.includeProduto,
      orderBy: { createdAt: "desc" },
    });
  }

  async findByProdutoId(produtoId: string) {
    return this.prisma.movimentacao.findMany({
      where: { produtoId },
      include: this.includeProduto,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return this.prisma.movimentacao.findUnique({
      where: { id },
      include: this.includeProduto,
    });
  }

  async cancelar(id: string) {
    return this.prisma.movimentacao.update({
      where: { id },
      data: { cancelada: true },
      include: this.includeProduto,
    });
  }

  /**
   * Transação atômica: cria movimentação E atualiza estoque do produto.
   * Se qualquer operação falhar, ambas são revertidas (rollback).
   */
  async createWithEstoqueUpdate(data: CreateMovimentacaoData, novoEstoque: number) {
    return this.prisma.$transaction(async (tx) => {
      const movimentacao = await tx.movimentacao.create({
        data,
        include: this.includeProduto,
      });

      await tx.produto.update({
        where: { id: data.produtoId },
        data: { quantidadeEstoque: novoEstoque },
      });

      return movimentacao;
    });
  }

  /**
   * Transação atômica: cancela movimentação E reverte o estoque.
   */
  async cancelarWithEstoqueRevert(id: string, novoEstoque: number) {
    return this.prisma.$transaction(async (tx) => {
      const movimentacao = await tx.movimentacao.findUnique({
        where: { id },
        include: this.includeProduto,
      });

      if (!movimentacao) {
        throw new Error("Movimentação não encontrada");
      }

      const movimentacaoAtualizada = await tx.movimentacao.update({
        where: { id },
        data: { cancelada: true },
        include: this.includeProduto,
      });

      await tx.produto.update({
        where: { id: movimentacao.produtoId },
        data: { quantidadeEstoque: novoEstoque },
      });

      return movimentacaoAtualizada;
    });
  }
}
