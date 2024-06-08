import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { artefatoRouter } from './routers/artefatoRouter';
import { eventoRouter } from './routers/eventoRouter';
import { authMiddleware } from './middlewares/authMiddleware';
import dotenv from 'dotenv';
import cors from 'cors';
import { categoriaRouter } from './routers/categoriaRouter';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

app.use(authMiddleware);
app.use('/artefato', artefatoRouter);
app.use('/evento', eventoRouter);
app.use('/categoria', categoriaRouter);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
