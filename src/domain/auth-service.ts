import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";


export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async checkCredentials(login: string, password: string)/*: Promise<UserResponseType | null> */ {
        const user = await usersRepository.findUserByLogin(login) // LOGIN
        console.log('checkCredentials', user)
        if (!user) return null
        const result: boolean = await bcrypt.compare(password, user.accountData.passwordHash)
        if (result) return user
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate > new Date()) return false; //????!!!! < || >   Date??? date-fns/add DATE сравнение
        const isConfirmed = await usersRepository.updateConfirmation(user?._id)//
        if (!isConfirmed) return false
        // if (user.emailConfirmation.confirmationCode !== code) return false;
        return isConfirmed
    }
}

