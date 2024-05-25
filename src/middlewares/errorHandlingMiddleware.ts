import { NextFunction, Request, Response } from "express";
import { AlreadyCreatedRegister } from "../exceptions/AlreadyCreatedRegister";
import { ValidationException } from "../exceptions/ValidationException";
import { Prisma } from "@prisma/client";

export const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AlreadyCreatedRegister) {
        res.status(409).send({ error: err.message });
        return;
    } 
    
    if (err instanceof ValidationException) {
        res.status(400).send({ error: err.message });
        return;
    }
    
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        let message = err.message;
        if (err.code === 'P2025') {
            message = 'Registro não encontrado';
        }

        res.status(404).send({ error: message });
        return;
    }

    res.status(500).send({ error: err.message });
}