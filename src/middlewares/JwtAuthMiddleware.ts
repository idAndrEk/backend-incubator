import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const JwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return res.sendStatus(401)
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) return res.sendStatus(401)
    const tokenData = await jwtService.validateAccessToken(accessToken)
    if (!tokenData) return res.sendStatus(401)
    const user = await usersService.findUserById(tokenData.userId)
    if (!user) return res.sendStatus(401)
    req.user = user;
    return next()
}

export const JwtRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const requestRefreshToken = req.cookies.refreshToken
    console.log('requestRefreshToken', requestRefreshToken)
    if (!requestRefreshToken) return res.status(401).send('no cookies')
    const validRefreshToken = await jwtService.refresh(requestRefreshToken)
    if (!validRefreshToken) return res.status(401).send('token is expired')
    const user = await usersService.findUserById(requestRefreshToken.userId)
    if (!user) return res.status(401).send('no user')
    req.user = user;
    return next()
}

//  забрали рефрешТокен из куков
// проверили был ли он там
// проверить сам рефреш токен:
// 1. узнать что он не просрочен
// 2. достать из него логин юзера
// 3. проверить что юзер в бд
// 4. проверить что токен есть в списке разрешенных
