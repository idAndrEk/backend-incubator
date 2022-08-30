import jwt, {Jwt, JwtPayload} from 'jsonwebtoken'
import {envSetting} from "../env_setting";
import {TokenType, UserAccType, UserResponseType} from '../types/UsersTypes'
import {ObjectId} from "mongodb";
import {usersService} from "../domain/users-service";
import {usersRepository} from "../repositories/users-repository";

export const jwtService = {
    async generateToken(user: UserAccType) {
        const accessToken = jwt.sign({userId: user._id}, envSetting.JWT_ACCESS, {expiresIn: '10s'})
        const refreshToken = jwt.sign({userId: user._id}, envSetting.JWT_REFRESH, {expiresIn: '20s'})
        const token = {
            _id: new ObjectId,
            refreshToken: refreshToken
        }
        await usersRepository.addTokenDB(token)
        return {
            accessToken,
            refreshToken
        }
    },
        //     async saveToken(refreshToken: string) {
        //     const tokenData =
        //         if (tokenData) {
        //
        //         }
        // }
    }



// export const jwtService = {
//     async createJWT(user: UserAccType) {
//         const token = jwt.sign({userId: user._id}, envSetting.JWT_SECRET, {expiresIn: '1h'}) //!!!!!!
//         return token
//     },
//     async getUserIdByToken(token: string) {
//         try {
//             const result: any = jwt.verify(token, envSetting.JWT_SECRET);
//             // const result = jwt.verify(token, envSetting.JWT_SECRET) as JwtPayload & UserResponseType
//             // console.log('getUserIdByToken', result)
//             return new ObjectId(result.userId)
//         } catch (error) {
//             return null
//         }
//     }
// }