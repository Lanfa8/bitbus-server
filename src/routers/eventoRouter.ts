import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { eventoController } from '../controllers/eventoController';

export const eventoRouter = express.Router();

eventoRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const evento = {
    ...req.body.evento
  };

  try {
    const register = await eventoController.save(evento);
    res.status(200).send(register);
  } catch (error) {
    next(error);
  }
});

eventoRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const filters = {
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 20,
    local: req.query.local as string|undefined,
    tipo: req.query.tipo ? Number(req.query.tipo) : undefined as number|undefined
  };

  try {
    const result = await eventoController.list(filters);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

eventoRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const evento = {
    ...req.body.evento
  };

  try {
    const register = await eventoController.update(Number(req.params.id), evento);
    res.status(200).send(register);
  } catch (error) {
    next(error);
  }
});

eventoRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventoController.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

eventoRouter.use(errorHandlingMiddleware);
