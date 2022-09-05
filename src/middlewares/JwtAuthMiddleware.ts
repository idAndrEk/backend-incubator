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
    if (!requestRefreshToken) return res.status(401).send('no cookies')
    const validRefreshToken = jwtService.refresh(requestRefreshToken)
    if (!validRefreshToken) return res.status(401).send('token is expired')
    const userValidation = await jwtService.validateAccessToken(requestRefreshToken)
    if (!userValidation) return res.status(401).send('no user')
    await jwtService.logout(requestRefreshToken)
    req.user = await usersService.findUserById(requestRefreshToken.userId);
    return next()
}


//  забрали рефрешТокен из куков
// проверили был ли он там
// 1. узнать что он не просрочен
// 2. достать из него логин юзера
// 3. проверить что токен есть в списке разрешенных
// 4. проверить что юзер в бд