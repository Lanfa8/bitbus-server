import { artefatoController } from '../controllers/artefatoController';
import { errorHandlingMiddleware } from '../middlewares/errorHandlingMiddleware';
import express, { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { authMiddleware } from '../middlewares/authMiddleware';

type UploadedFile = fileUpload.UploadedFile;
export const artefatoRouter = express.Router();

artefatoRouter.use(authMiddleware);
artefatoRouter.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/',
  debug: true
}));

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

artefatoRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const filters = {
    page: Number(req.query.page) || 1,
    pageSize: Number(req.query.pageSize) || 20,
    nome: req.query.nome as string|undefined,
    codigo: req.query.codigo as string|undefined,
    categoria: req.query.categoria as string|undefined
  };

  try {
    const result = await artefatoController.list(filters);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

function isUploadedFile(file: UploadedFile | UploadedFile[]): file is UploadedFile {
  return typeof file === 'object' && (file as UploadedFile).name !== undefined;
}

artefatoRouter.put("/:id/foto", async (req: Request, res: Response, next: NextFunction) => { 
  console.log("teste")
  if (req.files === undefined || req.files.photo === undefined || !isUploadedFile(req.files.photo)) {
    next(new Error('Arquivo de imagem não informado'));
    return;
  }

  const file = req.files.photo;

  try {
    const UFileName = `${new Date().getTime()}-${file.name.replace(/ /g, "-")}`;

    file.mv(`${process.cwd()}/src/public/uploads/${UFileName}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      const register = await artefatoController.setPhoto(Number(req.params.id), `/uploads/${UFileName}`);
      res.status(200).send({ fileName: UFileName, filePath: `/uploads/${UFileName}` });
    });
    
  } catch (error) {
    next(error);
  }
});

artefatoRouter.use(errorHandlingMiddleware);