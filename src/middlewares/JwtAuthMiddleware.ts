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