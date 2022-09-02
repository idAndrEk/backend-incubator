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
    //  забрали рефрешТокен из куков
    const requestRefreshToken = req.cookies.refreshToken
    console.log('requestRefreshToken', requestRefreshToken)
    // проверили был ли он там
    if (!requestRefreshToken) return res.status(401).send('no cookies')
    // 1. узнать что он не просрочен
    // 2. достать из него логин юзера
    // 3. проверить что токен есть в списке разрешенных
    const validRefreshToken = await jwtService.refresh(requestRefreshToken)
    if (!validRefreshToken) return res.status(401).send('token is expired')
    // 4. проверить что юзер в бд
    const user = await usersService.findUserById(requestRefreshToken.userId)
    if (!user) return res.status(401).send('no user')
    await jwtService.logout(requestRefreshToken)
    req.user = user;
    return next()
}


