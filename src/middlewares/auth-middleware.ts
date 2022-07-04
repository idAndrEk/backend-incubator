import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const base64 = Buffer.from('admin:qwerty').toString('base64');
    const encode = `Basic ${base64}`;
    if(authHeader === encode){
        next()
    } else {
        res.status(401).send('Access denied')
    }
}




// const str = 'admin:qwerty';
// const buff = Buffer.from(str, 'utf-8');
// const base64 = buff.toString('base64')