// =============================================================================
// REPOSITÓRIO DE CATEGORIAS (Implementação Prisma)
// =============================================================================
// Camada de acesso a dados: apenas operações no banco, sem regras de negócio.
// =============================================================================

import { PrismaClient } from "@prisma/client";
import {
  ICategoriaRepository,
  CreateCategoriaData,
  UpdateCategoriaData,
} from "../interfaces/ICategoriaRepository";

export class CategoriaRepository implements ICategoriaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateCategoriaData) {
    return this.prisma.categoria.create({ data });
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { nome: "asc" },
    });
  }

  async findById(id: string) {
    return this.prisma.categoria.findUnique({ where: { id } });
  }

  async findByNome(nome: string) {
    return this.prisma.categoria.findUnique({ where: { nome } });
  }

  async update(id: string, data: UpdateCategoriaData) {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.categoria.delete({ where: { id } });
  }

  async countProdutos(categoriaId: string) {
    return this.prisma.produto.count({
      where: { categoriaId },
    });
  }
}
