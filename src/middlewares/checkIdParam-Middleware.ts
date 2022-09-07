import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const checkIdParamMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        new ObjectId(id)
    } catch (error) {
        res.sendStatus(404)
        return
    }
    next()
}