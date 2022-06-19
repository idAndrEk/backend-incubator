import {NextFunction, Request, Response} from "express";

const auth = require('basic-auth')
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = auth(req)
    const username: string = 'admin'
    const password: string = 'qwerty'
    if(user.name === username && user.password === password){
        next()
    } else {
        res.status(401)
        res.end('Access denied')
    }
}
