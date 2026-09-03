import { PrismaClient } from "@prisma/client";
import {
  IProdutoRepository,
  CreateProdutoData,
  UpdateProdutoData,
  PaginationParams,
} from "../interfaces/IProdutoRepository";

export class ProdutoRepository implements IProdutoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private readonly includeCategoria = { categoria: true } as const;

  async create(data: CreateProdutoData) {
    return this.prisma.produto.create({
      data: {
        nome: data.nome,
        sku: data.sku,
        descricao: data.descricao,
        preco: data.preco,
        categoriaId: data.categoriaId,
      },
      include: this.includeCategoria,
    });
  }

  async findAllPaginated({ page, limit }: PaginationParams) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.produto.findMany({
        skip,
        take: limit,
        include: this.includeCategoria,
        orderBy: { nome: "asc" },
      }),
      this.prisma.produto.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.produto.findUnique({
      where: { id },
      include: this.includeCategoria,
    });
  }

  async findBySku(sku: string) {
    return this.prisma.produto.findUnique({ where: { sku } });
  }

  async update(id: string, data: UpdateProdutoData) {
    return this.prisma.produto.update({
      where: { id },
      data,
      include: this.includeCategoria,
    });
  }

  async delete(id: string) {
    await this.prisma.produto.delete({ where: { id } });
  }

  async updateEstoque(id: string, quantidade: number) {
    return this.prisma.produto.update({
      where: { id },
      data: { quantidadeEstoque: quantidade },
    });
  }

  async findByIdSimple(id: string) {
    return this.prisma.produto.findUnique({ where: { id } });
  }
}
