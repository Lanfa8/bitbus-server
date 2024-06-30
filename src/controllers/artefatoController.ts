import { prisma } from '../utils/connection';
import { AlreadyCreatedRegister } from '../exceptions/AlreadyCreatedRegister';
import { artefato as ArtefatoEntity } from '@prisma/client';
import { ValidationException } from '../exceptions/ValidationException';
import { validateObjectNodes } from '../utils/validation';
import { PaginationTypes } from 'src/utils/paginationTypes';

export const artefatoController = {
    async save(artefato: Partial<ArtefatoEntity> & {
        categoria: string;
    }): Promise<ArtefatoEntity> {
        await artefatoController.validateArtefato(artefato);

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
                origem: String(artefato.origem),
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
    async validateArtefato(artefato: Partial<ArtefatoEntity> & {
        categoria: string;
    }): Promise<void> {
        const camposObrigatorios = ['nome', 'codigo', 'informacoes', 'ano', 'quantidade', 'origem', 'categoria'];
        const camposNaoPreenchidos = validateObjectNodes(artefato, camposObrigatorios);
        
        if (camposNaoPreenchidos.length) {
            throw new ValidationException(`Campos obrigatórios não preenchidos: ${camposNaoPreenchidos.join(', ')}`, [...camposNaoPreenchidos]);
        }

        return Promise.resolve();
    },
    async update(id: number, artefato: Partial<ArtefatoEntity> & {categoria: string}): Promise<ArtefatoEntity> {
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

        const updated = await prisma.artefato.update({
            where: {
                id
            },
            data: {
                ano: artefato.ano,
                categoriaId: categoria.id,
                codigo: artefato.codigo,
                dimensoes: artefato.dimensoes,
                informacoes: artefato.informacoes,
                link: artefato.link,
                localArmazenamento: artefato.localArmazenamento,
                nome: artefato.nome,
                origem: String(artefato.origem),
                quantidade: artefato.quantidade,
                fotoMiniatura: artefato.fotoMiniatura
            }
        });

        return updated;
    },
    async delete(id: number): Promise<void> {
        if (!id) throw new ValidationException('ID não informado', ['id']);

        await prisma.artefato.delete({
            where: {
                id
            }
        });
    },
    async list(filters: PaginationTypes.Pagination & {
        nome?: string;
        codigo?: string;
        categoria?: string;
    }): Promise<PaginationTypes.PaginationResponse<ArtefatoEntity>> {
        const { page, pageSize, nome, codigo, categoria } = filters;
        const where = {
            nome: {
                contains: nome
            },
            codigo: {
                contains: codigo
            },
            categoria: {
                descricao: {
                    contains: categoria
                }
            }
        };

        const total = await prisma.artefato.count({
            where
        });

        const data = await prisma.artefato.findMany({
            where,
            include: {
                categoria: true
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        return {
            data,
            total
        };
    
    },
    async setPhoto(id: number, photo: string): Promise<ArtefatoEntity> {
        const updated = await prisma.artefato.update({
            where: {
                id
            },
            data: {
                fotoMiniatura: photo
            }
        });

        return updated;
    }
};