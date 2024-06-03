import { prisma } from '../utils/connection';
import { AlreadyCreatedRegister } from '../exceptions/AlreadyCreatedRegister';
import { evento as EventoEntity, pessoa as PessoaEntity } from '@prisma/client';
import { ValidationException } from '../exceptions/ValidationException';
import { validateObjectNodes } from '../utils/validation';
import { PaginationTypes } from 'src/utils/paginationTypes';

export const eventoController = {
    async save(evento: Partial<EventoEntity> & {
        responsavel: Partial<PessoaEntity>;
    }): Promise<EventoEntity> {
        await eventoController.validateEvento(evento);
        evento.data = new Date(evento.data);

        const saved = await prisma.evento.findFirst({
            where: {
                local: evento.local,
                data: evento.data
            }
        });

        if (saved) {
            throw new AlreadyCreatedRegister('Um evento para esse local e data já foi cadastrado');
        }

        let pessoa = await prisma.pessoa.findFirst({
            where: {
                email: evento.responsavel.email
            }
        });

        //TODO: Criar enum para tipo de pessoa
        if (!pessoa) {
            pessoa = await prisma.pessoa.create({
                data: {
                    nome: evento.responsavel.nome,
                    email: evento.responsavel.email,
                    tipo: evento.responsavel.tipo
                }
            });
        }

        const newEvento = await prisma.evento.create({
            data: {
                data: evento.data,
                local: evento.local,
                tipo: evento.tipo,
                pessoa: {
                    connect: {
                        id: pessoa.id
                    }
                },
            }
        });

        return newEvento;
    },
    async validateEvento(evento: Partial<EventoEntity> & {
        responsavel: Partial<PessoaEntity>;
    }): Promise<void> {
        const camposObrigatorios = ['data', 'local', 'tipo', 'responsavel'];
        const camposNaoPreenchidos = validateObjectNodes(evento, camposObrigatorios);
        
        if (camposNaoPreenchidos.length) {
            throw new ValidationException(`Campos obrigatórios não preenchidos: ${camposNaoPreenchidos.join(', ')}`);
        }

        if (evento.data && isNaN(new Date(evento.data).getTime())) {
            throw new ValidationException('Data inválida');
        }

        const camposResponsavel = ['nome', 'email', 'tipo'];
        const camposNaoPreenchidosResponsavel = validateObjectNodes(evento.responsavel, camposResponsavel);

        if (camposNaoPreenchidosResponsavel.length) {
            throw new ValidationException(`Campos obrigatórios do nodo 'responsavel' não preenchidos: ${camposNaoPreenchidosResponsavel.join(', ')}`);
        }

        return Promise.resolve();
    },
    async update(id: number, evento: Partial<EventoEntity>): Promise<EventoEntity> {
        if (!id) throw new ValidationException('ID não informado');
        
        const updated = await prisma.evento.update({
            where: {
                id
            },
            data: evento
        });

        return updated;
    },
    async delete(id: number): Promise<void> {
        if (!id) throw new ValidationException('ID não informado');

        await prisma.evento.delete({
            where: {
                id
            }
        });
    },
    async list(filters: PaginationTypes.Pagination & {
        local?: string;
        tipo?: number;
    }): Promise<PaginationTypes.PaginationResponse<EventoEntity>> {
        const { page, pageSize, local, tipo } = filters;
        const where = {
            local: {
                contains: local
            },
            tipo: tipo
        };

        const total = await prisma.evento.count({
            where
        });

        const data = await prisma.evento.findMany({
            where,
            include: {
                pessoa: true
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        return {
            data,
            total
        };
    
    }
};