import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { categoriaController } from '../controllers/categoriaController';

export const categoriaRouter = express.Router();

categoriaRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoriaController.getAll();
    res.status(200).send({
      data: result
    });
  } catch (error) {
    next(error);
  }
});

categoriaRouter.use(errorHandlingMiddleware);
