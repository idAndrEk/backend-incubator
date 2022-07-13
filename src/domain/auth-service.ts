import bcrypt from "bcrypt";
import {UserDBType} from "../types/UsersTypes";
import {usersRepository} from "../repositories/users-repository";

export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    // async validatePassrowd(password: string, hash: string) {
    //     const isValide =  await bcrypt.compare(password, hash)
    //     return isValide
    // },

    async validatePassword(login: string, password: string): Promise<UserDBType | null> {
        const user = await usersRepository.findUserByLogin(login) // LOGIN
        if (!user) {
            return null
        }
        const result = await bcrypt.compare(password, user.passwordHash)
        if (result) {
            return user
        }
        return null
    }
}

