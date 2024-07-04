import { prisma } from '../utils/connection';
import { AlreadyCreatedRegister } from '../exceptions/AlreadyCreatedRegister';
import { evento as EventoEntity, pessoa as PessoaEntity } from '@prisma/client';
import { ValidationException } from '../exceptions/ValidationException';
import { validateObjectNodes } from '../utils/validation';
import { PaginationTypes } from 'src/utils/paginationTypes';
import { mailController } from './mailController';

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
                nome: evento.nome,
                descricao: evento.descricao,
                pessoa: {
                    connect: {
                        id: pessoa.id
                    }
                },
            }
        });

        this.sendEmailWithEventDetails(newEvento.id);

        return newEvento;
    },
    async validateEvento(evento: Partial<EventoEntity> & {
        responsavel: Partial<PessoaEntity>;
    }): Promise<void> {
        const camposObrigatorios = ['data', 'local', 'tipo', 'responsavel'];
        const camposNaoPreenchidos = validateObjectNodes(evento, camposObrigatorios);
        
        if (camposNaoPreenchidos.length) {
            throw new ValidationException(`Campos obrigatórios não preenchidos: ${camposNaoPreenchidos.join(', ')}`, [...camposNaoPreenchidos]);
        }

        if (evento.data && isNaN(new Date(evento.data).getTime())) {
            throw new ValidationException('Data inválida', ['data']);
        }

        const camposResponsavel = ['nome', 'email', 'tipo'];
        const camposNaoPreenchidosResponsavel = validateObjectNodes(evento.responsavel, camposResponsavel);

        if (camposNaoPreenchidosResponsavel.length) {
            throw new ValidationException(`Campos obrigatórios do nodo 'responsavel' não preenchidos: ${camposNaoPreenchidosResponsavel.join(', ')}`, [...camposNaoPreenchidosResponsavel]);
        }

        return Promise.resolve();
    },
    async update(id: number, evento: Partial<EventoEntity  & {
        responsavel: Partial<PessoaEntity>;
    }>): Promise<EventoEntity> {
        if (!id) throw new ValidationException('ID não informado', ['id']);

        let pessoa = await prisma.pessoa.findFirst({
            where: {
                email: evento.responsavel.email
            }
        });

        if (!pessoa) {
            pessoa = await prisma.pessoa.create({
                data: {
                    nome: evento.responsavel.nome,
                    email: evento.responsavel.email,
                    tipo: evento.responsavel.tipo
                }
            });
        }
        
        const updated = await prisma.evento.update({
            where: {
                id
            },
            data: {
                data: evento.data,
                local: evento.local,
                tipo: evento.tipo,
                nome: evento.nome,
                descricao: evento.descricao,
                pessoa: {
                    connect: {
                        id: pessoa.id
                    }
                },
            }
        });

        return updated;
    },
    async delete(id: number): Promise<void> {
        if (!id) throw new ValidationException('ID não informado', ['id']);

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
    },
    async setPhoto(id: number, foto: string): Promise<EventoEntity> {
        const updated = await prisma.evento.update({
            where: {
                id
            },
            data: {
                foto
            }
        });

        return updated;
    },
    async sendEmailWithEventDetails(id: number): Promise<boolean> {
        const evento = await prisma.evento.findUnique({
            where: {
                id
            },
            include: {
                pessoa: true
            }
        });

        if (!evento) {
            throw new ValidationException('Evento não encontrado', ['id']);
        }

        try {            
            mailController.sendMail(
                `Olá ${evento.pessoa.nome}, o evento ${evento.nome} foi cadastrado com sucesso!`,
                'Evento cadastrado com sucesso', 
                evento.pessoa.email
            );
        } catch (error) {
            console.error(error);
            return false;
        }

        return true;
    },
    async addInscrito(id: number, inscrito: Partial<PessoaEntity>): Promise<void> {
        const pessoa = await prisma.pessoa.findFirst({
            where: {
                email: inscrito.email
            }
        });

        if (!pessoa) {
            throw new ValidationException('Pessoa não encontrada', ['email']);
        }

        if (await prisma.inscrito.findFirst({
            where: {
                eventoId: id,
                pessoaId: pessoa.id
            }
        })) {
            throw new AlreadyCreatedRegister('Pessoa já inscrita nesse evento');
        }

        await prisma.inscrito.create({
            data: {
                eventoId: id,
                pessoaId: pessoa.id
            }
        });
    },
    async removeInscrito(id: number, inscrito: Partial<PessoaEntity>): Promise<void> {
        const pessoa = await prisma.pessoa.findFirst({
            where: {
                email: inscrito.email
            }
        });

        if (!pessoa) {
            throw new ValidationException('Pessoa não encontrada', ['email']);
        }

        await prisma.inscrito.deleteMany({
            where: {
                eventoId: id,
                pessoaId: pessoa.id
            }
        });
    },
    async listInscritos(id: number): Promise<PessoaEntity[]> {
        const inscritos = await prisma.inscrito.findMany({
            where: {
                eventoId: id
            },
            include: {
                pessoa: true
            }
        });

        return inscritos.map(inscrito => inscrito.pessoa);
    }

};