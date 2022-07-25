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
        res.send(404)
        return
    }
    next()
}

export const authMiddlewareUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    // Bearer adrgethtrhrthstrhsrth
    const token = req.headers.authorization.split(' ')[1]
    const userId: any = await jwtService.getUserIdByToken(token);// ANY!!!
    if (userId) {
        req.user = await usersService.findUserById(userId)
        // const user = await usersService.findUserById(userId)
        // return user
        // req.user = user;
        next()
    }
    res.send(401)
}


// const str = 'admin:qwerty';
// const buff = Buffer.from(str, 'utf-8');
// const base64 = buff.toString('base64')