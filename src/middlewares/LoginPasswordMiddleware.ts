import {Request, Response, NextFunction} from "express";
import {authService} from "../domain/auth-service";

export const LoginPasswordMiddleware = async (req: Request, res: Response, next: NextFunction
) => {
    const user = await authService.checkCredential(req.body.login)
    if(!user) {
        return res.status(401).send('Not registered')
    }
    const password = await authService.checkPassword(req.body.password, user.accountData.passwordHash)
    if (!password) {
        return res.status(401).send('Not registered')
    }
    next()
}