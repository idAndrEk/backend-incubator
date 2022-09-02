import {tokenCollection} from "./db";

export const jwtRepository = {

    async removeToken(refreshToken: string) {
        return await tokenCollection.deleteOne({refreshToken});

    },

    async addTokenToDB(refreshToken: string) {
        return await tokenCollection.insertOne({refreshToken})
    },

    async findTokenToDB(refreshToken: string) {
        return await tokenCollection.findOne({refreshToken})
    }
}

