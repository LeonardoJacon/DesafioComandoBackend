import { AppError } from "../errors/AppError";
import { ICategoriaRepository } from "../repositories/interfaces/ICategoriaRepository";
import { CreateCategoriaInput, UpdateCategoriaInput } from "../schemas/categoria.schema";

export class CategoriaService {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async criar(data: CreateCategoriaInput) {
    const existente = await this.categoriaRepository.findByNome(data.nome);
    if (existente) {
      throw new AppError("Já existe uma categoria com este nome", 409);
    }

    return this.categoriaRepository.create(data);
  }

  async listar() {
    return this.categoriaRepository.findAll();
  }

  async buscarPorId(id: string) {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return categoria;
  }

  async atualizar(id: string, data: UpdateCategoriaInput) {
    await this.buscarPorId(id); 

    const existente = await this.categoriaRepository.findByNome(data.nome);
    if (existente && existente.id !== id) {
      throw new AppError("Já existe uma categoria com este nome", 409);
    }

    return this.categoriaRepository.update(id, data);
  }

  async deletar(id: string) {
    await this.buscarPorId(id);


    const quantidadeProdutos = await this.categoriaRepository.countProdutos(id);
    if (quantidadeProdutos > 0) {
      throw new AppError(
        `Não é possível excluir a categoria. Existem ${quantidadeProdutos} produto(s) vinculado(s).`,
        409
      );
    }

    await this.categoriaRepository.delete(id);
  }
}
