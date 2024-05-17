import { disconnect } from "../utils/connection";

export const disconnectDbMiddleware = async (req, res, next) => {
    try {
        await disconnect();
        next();
    } catch (error) {
        next(error);
    }
}