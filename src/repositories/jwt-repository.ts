import {TokenModelClass} from "./db";

export const jwtRepository = {

    async removeToken(refreshToken: string) {
        return TokenModelClass.deleteMany({refreshToken});

    },

    async addTokenToDB(refreshToken: string) {
        return await TokenModelClass.insertMany({refreshToken})
    },

    async findTokenToDB(refreshToken: string) {
        return TokenModelClass.findOne({refreshToken})
    }
}

