import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { artefatoController } from './controllers/artefatoController';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';

const app = express();
const artefatoRouter = express.Router();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

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

artefatoRouter.use(errorHandlingMiddleware);
app.use('/artefato', artefatoRouter);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
