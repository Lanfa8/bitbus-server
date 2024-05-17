import express from 'express';
import { Request, Response } from 'express';
import { artefatoController } from './controllers/artefatoController';
import { disconnect } from './utils/connection';
import { AlreadyCreatedRegister } from './exceptions/AlreadyCreatedRegister';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

app.post("/artefato", async (req: Request, res: Response) => {
  const artefato = {
    descricao: req.body.descricao,
    nome: req.body.nome,
    origem: req.body.origem,
    categoria: req.body.categoria
  };

  try {
    const register = await artefatoController.save(artefato);
    res.status(200).send(register);
  } catch (error) {
    if (error instanceof AlreadyCreatedRegister) {
      res.status(409).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }

  await disconnect();
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});