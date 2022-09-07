import {TokenModel} from "./db";

export const jwtRepository = {

    async removeToken(refreshToken: string) {
        return TokenModel.deleteMany({refreshToken});

    },

    async addTokenToDB(refreshToken: string) {
        return await TokenModel.insertMany({refreshToken})
    },

    async findTokenToDB(refreshToken: string) {
        return TokenModel.findOne({refreshToken})
    }
}

