import {Request, Response, NextFunction} from "express";
import {usersService} from "../composition-root";


export const LoginPasswordMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersService.checkCredential(req.body.login)
    if (!user) return res.status(401).send('Not registered')

    const password = await usersService.checkPassword(req.body.password, user.accountData.passwordHash)
    if (!password) return res.status(401).send('Not registered')

    req.user = user;
    return next()
}