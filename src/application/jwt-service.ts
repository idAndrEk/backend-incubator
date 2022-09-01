import jwt from 'jsonwebtoken'
import {envSetting} from "../env_setting";
import {UserAccType} from '../types/UsersTypes'

export const jwtService = {
    async createAccessJWT(user: UserAccType) {
        const token = jwt.sign({userId: user.id}, envSetting.JWT_ACCESS, {expiresIn: '10s'})
        return token
    },

    async createRefreshJWT(user: UserAccType) {
        const token = jwt.sign({userId: user.id}, envSetting.JWT_ACCESS, {expiresIn: '20s'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, envSetting.JWT_ACCESS);
            // const result = jwt.verify(token, envSetting.JWT_SECRET) as JwtPayload & UserResponseType
            // console.log('getUserIdByToken', result)
            return result.userId
        } catch (error) {
            return null
        }
    }
}



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