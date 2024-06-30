import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { pessoaController } from '../controllers/pessoaControllers';

export const pessoaRouter = express.Router();

pessoaRouter.use(authMiddleware);
pessoaRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pessoaController.getAll();
    res.status(200).send({
      data: result
    });
  } catch (error) {
    next(error);
  }
});

pessoaRouter.use(errorHandlingMiddleware);
