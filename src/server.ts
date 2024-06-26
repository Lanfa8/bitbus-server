import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { artefatoRouter } from './routers/artefatoRouter';
import { eventoRouter } from './routers/eventoRouter';
import dotenv from 'dotenv';
import cors from 'cors';
import { categoriaRouter } from './routers/categoriaRouter';
import { pessoaRouter } from './routers/pessoaRouter';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

app.use('/artefato', artefatoRouter);
app.use('/evento', eventoRouter);
app.use('/categoria', categoriaRouter);
app.use('/pessoa', pessoaRouter);
app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
