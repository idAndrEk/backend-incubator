import jwt from 'jsonwebtoken'
import {envSetting} from "../env_setting";
import {UserAccType} from '../types/UsersTypes'
import {jwtRepository} from "../repositories/jwt-repository";

export const jwtService = {
    async createAccessJWT(user: UserAccType) {
        const token = jwt.sign({userId: user.id}, envSetting.JWT_ACCESS, {expiresIn: '10m'})
        return token
    },

    async createRefreshJWT(user: UserAccType) {
        const token = jwt.sign({userId: user.id}, envSetting.JWT_REFRESH, {expiresIn: '20m'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, envSetting.JWT_ACCESS);
            return result.userId
        } catch (error) {
            return null
        }
    },

    async validateAccessToken(token: string) {
        try {
            const userData: any = jwt.verify(token, envSetting.JWT_ACCESS);
            return userData;
        } catch (e) {
            return null
        }
    },

    async validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, envSetting.JWT_REFRESH);
            return userData;
        } catch (e) {
            return null
        }
    },

    async refresh(refreshToken: string) {
        if (!refreshToken) return null
        const userData = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await jwtRepository.findTokenToDB(refreshToken);
        if (!userData || !tokenFromDb) {
            return null
        }
        return refreshToken
    }
}


// аналог в AuthService
// async refreshTokenDB(refreshToken: string) {
//     await jwtRepository.addTokenToDB(refreshToken)
//     return
// },


//     async generateToken(user: any) { // <ANY> !!!!!!!!!
//         const accessToken = jwt.sign({userId: user._id}, envSetting.JWT_ACCESS, {expiresIn: '10s'})
//         const refreshToken = jwt.sign({userId: user._id}, envSetting.JWT_REFRESH, {expiresIn: '20s'})
//         const token = {
//             _id: new ObjectId,
//             refreshToken: refreshToken
//         }
//         await usersRepository.addTokenDB(token)
//         return {
//             accessToken,
//             refreshToken
//         }
//     }
// }


// export const jwtService = {
//     async createJWT(user: UserAccType) {
//         const token = jwt.sign({userId: user._id}, envSetting.JWT_SECRET, {expiresIn: '1h'}) //!!!!!!
//         return token
//     },

// }