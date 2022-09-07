import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
        return next()
    } else {
        return res.status(401).send('Access denied')
    }
}

export const authMiddlewareUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.send(401)
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        const user = await usersService.findUserById(userId)
        req.user = user;
        return next()
    }
    return res.sendStatus(401)
    }











