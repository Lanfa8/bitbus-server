import express from 'express';
import { Request, Response } from 'express';
import { artefatoController } from './controllers/artefatoController';
import { AlreadyCreatedRegister } from './exceptions/AlreadyCreatedRegister';
import { ValidationException } from './exceptions/ValidationException';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'API is running!'
  });
});

app.post("/artefato", async (req: Request, res: Response) => {
  const artefato = {
    ...req.body.artefato
  };

  try {
    const register = await artefatoController.save(artefato);
    res.status(200).send(register);
    return;
  } catch (error) {
    if (error instanceof AlreadyCreatedRegister) {
      res.status(409).send({ error: error.message });
      return;
    } 
    
    if (error instanceof ValidationException) {
      res.status(400).send({ error: error.message });
      return;
    }
    
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});