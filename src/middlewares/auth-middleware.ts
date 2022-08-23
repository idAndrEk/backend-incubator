import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if (authHeader === encode) {
        next()
    } else {
        res.status(401).send('Access denied')
    }
}

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

export const authMiddlewareUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId: any = await jwtService.getUserIdByToken(token);// ANY!!!
    console.log(token)
    console.log(userId)
    if (userId) {
        const user = await usersService.findUserById(userId)
        req.user = user;
        return next()
    }
    res.sendStatus(401)
}



