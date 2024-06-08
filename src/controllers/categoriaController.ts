import { categoria } from "@prisma/client";
import { prisma } from "../utils/connection";

export const categoriaController = {
    async getAll(): Promise<Array<categoria>> {
        return await prisma.categoria.findMany();
    },

}