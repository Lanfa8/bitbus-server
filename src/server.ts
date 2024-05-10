import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { create } from 'domain';

const app = express();
app.use(express.json());
const prisma = new PrismaClient()

app.get('/', (req: Request, res: Response) => {
  res.send('Show de bola Márcio!');
});

app.post("/artefato", async (req: Request, res: Response) => {
  // Código para criar um artefato
  await prisma.artefato.create({
    data: {
      nome: req.body.nome,
      descricao: req.body.descricao,
      origem: req.body.origem,
      dataInclusao: new Date(),
      categoria: {
        create: {
          descricao: req.body.categoria
        }
      }
    }
  });

  const allArtefatos = await prisma.artefato.findMany({
    include: {
      categoria: true,
    },
  })
  res.send(allArtefatos);
  await prisma.$disconnect()
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});