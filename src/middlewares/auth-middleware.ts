import {NextFunction, Request, Response} from "express";
import {copyFileSync} from "fs";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const str = 'admin:qwerty';
    const buff = Buffer.from(str, 'utf-8');
    const base64 = buff.toString('base64')
    if(authHeader == base64){
        next()
    } else {
        res.status(401)
        res.send('Access denied')
    }
}

