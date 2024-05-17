import { artefato as artefatoEntity } from '@prisma/client'
import { prisma } from '../utils/connection'
import { AlreadyCreatedRegister } from '../exceptions/AlreadyCreatedRegister';

export const artefatoController = {
    async save(artefato: {
        nome: string;
        descricao: string;
        origem: string;
        categoria: string;
    }): Promise<artefatoEntity> {
        const saved = await prisma.artefato.findFirst({
            where: {
                nome: artefato.nome
            }
        });

        if (saved) {
            throw new AlreadyCreatedRegister('Um artefato com esse nome já foi cadastrado');
        }

        let categoria = await prisma.categoria.findFirst({
            where: {
                descricao: artefato.categoria
            }
        });

        if (!categoria) {
            categoria = await prisma.categoria.create({
                data: {
                    descricao: artefato.categoria
                }
            });
        }

        const newArtefato = await prisma.artefato.create({
            data: {
                nome: artefato.nome,
                descricao: artefato.descricao,
                origem: artefato.origem,
                dataInclusao: new Date(),
                categoria: {
                    connect: {
                        id: categoria.id
                    }
                }
            }
        });

        return newArtefato;
    },
    // async update(req: Request, res: Response) {
    //     const { id } = req.params;
    //     const artefato = await ArtefatoService.update(id, req.body);
    //     return res.json(artefato);
    // },
    // async delete(req: Request, res: Response) {
    //     const { id } = req.params;
    //     const artefato = await ArtefatoService.delete(id);
    //     return res.json(artefato);
    // },
};