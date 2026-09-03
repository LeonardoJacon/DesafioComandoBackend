import { Request, Response, NextFunction } from "express";
import { CategoriaService } from "../services/CategoriaService";

export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  criar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoria = await this.categoriaService.criar(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  };

  listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categorias = await this.categoriaService.listar();
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  };

  buscarPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoria = await this.categoriaService.buscarPorId(String(req.params.id));
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  };

  atualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoria = await this.categoriaService.atualizar(String(req.params.id), req.body);
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  };

  deletar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoriaService.deletar(String(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
