import { prisma } from '../utils/connection';
import { AlreadyCreatedRegister } from '../exceptions/AlreadyCreatedRegister';
import { artefato as artefatoEntity } from '@prisma/client';
import { ValidationException } from '../exceptions/ValidationException';

export const artefatoController = {
    async save(artefato: Partial<artefatoEntity> & {
        categoria: string;
    }): Promise<artefatoEntity> {
        const camposObrigatorios = ['nome', 'codigo', 'informacoes', 'ano', 'quantidade', 'origem', 'categoria'];
        const camposNaoPreenchidos = camposObrigatorios.filter(campo => !artefato[campo]);
        
        if (camposNaoPreenchidos.length) {
            throw new ValidationException(`Campos obrigatórios não preenchidos: ${camposNaoPreenchidos.join(', ')}`);
        }

        const saved = await prisma.artefato.findFirst({
            where: {
                codigo: artefato.codigo
            }
        });

        if (saved) {
            throw new AlreadyCreatedRegister('Um artefato com esse codigo já foi cadastrado');
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
                codigo: artefato.codigo,
                informacoes: artefato.informacoes,
                ano: artefato.ano,
                quantidade: artefato.quantidade,
                dimensoes: artefato.dimensoes,
                localArmazenamento: artefato.localArmazenamento,
                link: artefato.link,
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