import {NextFunction, Request, Response} from "express";
import {container, jwtService} from "../composition-root";
import {UsersQueryRepository} from "../repositories/users/usersQueryRepository";
import {log} from "util";

const usersQueryRepository = container.resolve(UsersQueryRepository)

export const JwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.sendStatus(401)

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) return res.sendStatus(401)

    const userId = await jwtService.validateAccessToken(accessToken)
    if (!userId) return res.sendStatus(401)

    const user = await usersQueryRepository.getUser(userId)
    if (!user) return res.sendStatus(401)

    req.user = user;
    return next()
}

export const JwtRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const requestRefreshToken = req.cookies.refreshToken
    if (!requestRefreshToken) return res.sendStatus(401)

    const userId = await jwtService.ValidateDbRefreshToken(requestRefreshToken)
    if (!userId) return res.sendStatus(401)

    await jwtService.logout(requestRefreshToken) // remove

    const user = await usersQueryRepository.getUser(userId)
    if (!user) return res.sendStatus(401)

    req.user = user;
    return next()
}

export const checkUserTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next()

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) return next()

    const userId = await jwtService.validateAccessToken(accessToken)
    if (!userId) return next()

    const user = await usersQueryRepository.getUser(userId)
    if (!user) return next()

    req.user = user;
    return next()
}
