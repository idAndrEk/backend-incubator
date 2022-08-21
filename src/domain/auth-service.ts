import bcrypt from "bcrypt";
import {UserResponseType} from "../types/UsersTypes";
import {usersRepository} from "../repositories/users-repository";
import add from 'date-fns/add';
import {v4 as uuidv4} from 'uuid'
import {ObjectId} from "mongodb";
import {emailsManager} from "../mail/emailsManager";

export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async checkCredentials(login: string, password: string): Promise<UserResponseType | null> {
        const user = await usersRepository.findUserByLogin(login) // LOGIN
        if (!user) {
            return null
        }
        const result: boolean = await bcrypt.compare(password, user.passwordHash)
        if (result) {
            return {
                id: user.id,
                login: user.login,
                email: user.email
            }
        }
        return null
    },


}

