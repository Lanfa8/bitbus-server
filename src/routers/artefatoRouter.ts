import { artefatoController } from '../controllers/artefatoController';
import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';

export const artefatoRouter = express.Router();

artefatoRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const artefato = {
    ...req.body.artefato
  };

  try {
    const register = await artefatoController.save(artefato);
    res.status(200).send(register);
  } catch (error) {
    next(error);
  }
});

artefatoRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const artefato = {
    ...req.body.artefato
  };

  try {
    const register = await artefatoController.update(Number(req.params.id), artefato);
    res.status(200).send(register);
  } catch (error) {
    next(error);
  }
});

artefatoRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await artefatoController.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

artefatoRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const filters = {
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 20,
    nome: req.query.nome as string|undefined,
    codigo: req.query.codigo as string|undefined,
    categoria: req.query.categoria as string|undefined
  };

  try {
    const result = await artefatoController.list(filters);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

artefatoRouter.use(errorHandlingMiddleware);