import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const JwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.sendStatus(401)

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) return res.sendStatus(401)

    const userId = await jwtService.validateAccessToken(accessToken)
    if (!userId) return res.sendStatus(401)

    const user = await usersService.findUserById(userId)
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

    const user = await usersService.findUserById(userId)
    if (!user) return res.sendStatus(401)
    req.user = user;
    return next()
}


//  забрали рефрешТокен из куков
// проверили был ли он там
// 1. узнать что он не просрочен
// 2. достать из него логин юзера
// 3. проверить что токен есть в списке разрешенных
// 4. проверить что юзер в бд