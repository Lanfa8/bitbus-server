import { NextFunction, Request, Response } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).send({ error: 'Token não informado' });
        return;
    }

    if (token !== ("Bearer " + process.env.VALIDATION_TOKEN)) {
        res.status(401).send({ error: 'Token inválido' });
        return;
    }

    next();
}