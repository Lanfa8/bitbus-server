import { pessoa } from "@prisma/client";
import { prisma } from "../utils/connection";

export const pessoaController = {
    async getAll(): Promise<Array<pessoa>> {
        return await prisma.pessoa.findMany();
    },

}