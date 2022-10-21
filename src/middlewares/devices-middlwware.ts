// import {NextFunction, Request, Response} from "express";
// import {jwtService} from "../composition-root";
//
//
// export const JwtRefreshDevicesIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     const requestAccessTokenToken = req.cookies.accessToken
//     if (!requestAccessTokenToken) return res.sendStatus(401)
//
//     const deviceId = await jwtService.deviceIdAccessToken(requestAccessTokenToken)
//     if (!deviceId) return res.sendStatus(401)
//
//     // const jwtPayload: any = jwt.verify(requestAccessTokenToken, envSetting.JWT_ACCESS);
//     // const id = jwtPayload.deviceId;
//     // console.log(id)
//
//     return deviceId
//     next()
// }