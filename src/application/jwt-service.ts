import jwt from 'jsonwebtoken'
import {envSetting} from "../env_setting";
import {UserAccType} from '../types/UsersTypes'
import {jwtRepository} from "../repositories/jwt-repository";

export class JwtService {

    async createAccessJWT(user: UserAccType) { // +++
        const token = jwt.sign({userId: user._id}, envSetting.JWT_ACCESS, {expiresIn: '10s'})
        return token
    }

    async createRefreshJWT(user: UserAccType) { // --- |
        const token = jwt.sign({userId: user._id}, envSetting.JWT_REFRESH, {expiresIn: '20s'})
        return token
    }

    async createDevicesIdRefreshJWT(user: UserAccType, deviceId: string) {
        const token = jwt.sign({userId: user._id, deviceId}, envSetting.JWT_REFRESH, {expiresIn: '20s'})
        return token
    }

    async validateAccessToken(token: string): Promise<string | null> {
        try {
            const jwtPayload: any = jwt.verify(token, envSetting.JWT_ACCESS);
            return jwtPayload.userId;
        } catch (e) {
            return null
        }
    }

    async deviceIdRefreshJToken(token: string): Promise<{ userId: string, deviceId: string, iat: Date, exp: Date } | null> {
        try {
            const jwtPayload: any = jwt.verify(token, envSetting.JWT_REFRESH);
            return {
                userId: jwtPayload.userId,
                deviceId: jwtPayload.deviceId,
                iat: new Date(jwtPayload.iat * 1000),
                exp: new Date(jwtPayload.exp * 1000)
            }
        } catch (e) {
            return null
        }
    }

    async validateRefreshToken(token: string): Promise<string | null> {
        try {
            const jwtPayload: any = jwt.verify(token, envSetting.JWT_REFRESH);
            return jwtPayload.userId
        } catch (e) {
            return null
        }
    }

    async ValidateDbRefreshToken(refreshToken: string) { //ValidateDbRefreshToken
        if (!refreshToken) return null
        const userId = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await jwtRepository.findTokenToDB(refreshToken);
        if (!userId || !tokenFromDb) return null
        return userId
    }

    async logout(refreshToken: string) {
        const token = await jwtRepository.removeToken(refreshToken);
        return token;
    }
}


