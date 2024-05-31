import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { artefatoRouter } from './routers/artefatoRouter';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

app.use('/artefato', artefatoRouter);

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
