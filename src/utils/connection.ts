import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const disconnect = async () => {
    await prisma.$disconnect();
};