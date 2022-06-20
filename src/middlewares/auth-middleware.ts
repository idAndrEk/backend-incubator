import {NextFunction, Request, Response} from "express";
import {copyFileSync} from "fs";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    // const str = 'admin:qwerty';
    // const buff = Buffer.from(str, 'utf-8')
    // const base 64 = buff.toString('base64')
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if(authHeader === encode){
        next()
    } else {
        res.status(401)
        res.send('Access denied')
    }
}

