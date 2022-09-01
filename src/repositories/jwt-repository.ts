import {tokenCollection} from "./db";
import {TokenType} from "../types/UsersTypes";

export const jwtRepository = {

    async logout(refreshToken: string) {
        const tokenData = await tokenCollection.deleteOne({refreshToken});
        return tokenData
    },

    async addTokenToDB(refreshToken: string) {
        return await tokenCollection.insertOne({refreshToken})
    },

    async findTokenToDB(refreshToken: string) {
        return await tokenCollection.findOne({refreshToken})
    }
}

