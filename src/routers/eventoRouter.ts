import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { eventoController } from '../controllers/eventoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { fileUploadController } from '../controllers/fileUploadController';

export const eventoRouter = express.Router();

eventoRouter.use(authMiddleware);
eventoRouter.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/',
  debug: true
}));

eventoRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const evento = {
    data: new Date(req.body.evento.data),
    local: req.body.evento.local as string,
    tipo: req.body.evento.tipo,
    responsavel: {
      nome: req.body.evento.responsavel.nome as string,
      email: req.body.evento.responsavel.email as string,
      tipo: req.body.evento.responsavel.tipo
    },
    nome: req.body.evento.nome as string,
    descricao: req.body.evento.descricao as string,
  };

  try {
    const register = await eventoController.save(evento as any);
    console.log(register)
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
    data: new Date(req.body.evento.data),
    local: req.body.evento.local as string,
    tipo: req.body.evento.tipo,
    responsavel: {
      nome: req.body.evento.responsavel.nome as string,
      email: req.body.evento.responsavel.email as string,
      tipo: req.body.evento.responsavel.tipo
    },
    nome: req.body.evento.nome as string,
    descricao: req.body.evento.descricao as string,
  };

  try {
    const register = await eventoController.update(Number(req.params.id), evento as any);
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

function isUploadedFile(file: UploadedFile | UploadedFile[]): file is UploadedFile {
  return typeof file === 'object' && (file as UploadedFile).name !== undefined;
}

eventoRouter.put("/:id/foto", async (req: Request, res: Response, next: NextFunction) => { 
  if (req.files === undefined || req.files.photo === undefined || !isUploadedFile(req.files.photo)) {
    console.log(req.files)
    next(new Error('Arquivo de imagem não informado'));
    return;
  }

  const file = req.files.photo;
  try {
    const savedFile = await fileUploadController.save(file);
    const register = await eventoController.setPhoto(Number(req.params.id), savedFile.filePath);
    res.status(200).send(register);
  } catch (error) {
    next(error);
  }

});

eventoRouter.use(errorHandlingMiddleware);
