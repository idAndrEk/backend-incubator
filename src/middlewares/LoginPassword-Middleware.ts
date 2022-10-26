import {Request, Response, NextFunction} from "express";
import {container,} from "../composition-root";
import {UsersService} from "../domain/users-service";

const usersService = container.resolve(UsersService)

export const LoginPasswordMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = await usersService.getUserByLogin(req.body.login)
    if (!user) return res.status(401).send('Not registered')

    const password = await usersService.checkPassword(req.body.password, user.accountData.passwordHash)
    if (!password) return res.status(401).send('Not registered')

    req.user = user;
    return next()
}


