import { Categoria } from "@prisma/client";

export interface CreateCategoriaData {
  nome: string;
}

export interface UpdateCategoriaData {
  nome: string;
}

export interface ICategoriaRepository {
  create(data: CreateCategoriaData): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findById(id: string): Promise<Categoria | null>;
  findByNome(nome: string): Promise<Categoria | null>;
  update(id: string, data: UpdateCategoriaData): Promise<Categoria>;
  delete(id: string): Promise<void>;
  countProdutos(categoriaId: string): Promise<number>;
}
