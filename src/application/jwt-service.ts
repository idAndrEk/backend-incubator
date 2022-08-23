import jwt, {Jwt, JwtPayload} from 'jsonwebtoken'
import {envSetting} from "../env_setting";
import {UserAccType, UserResponseType} from '../types/UsersTypes'
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: UserAccType) {
        const token = jwt.sign({userId: user._id}, envSetting.JWT_SECRET, {expiresIn: '1h'}) //!!!!!!
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, envSetting.JWT_SECRET);
            // const result = jwt.verify(token, envSetting.JWT_SECRET) as JwtPayload & UserResponseType
            console.log(result)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}