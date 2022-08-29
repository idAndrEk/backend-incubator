import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";
import {UserAccType} from "../types/UsersTypes";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";
import {emailsManager} from "../mail/emailsManager";


export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async checkCredentials(login: string, password: string)/*: Promise<UserResponseType | null> */ {
        const user = await usersService.findUserByLogin(login) // LOGIN
        // console.log('checkCredentials', user)
        if (!user) return null
        const result: boolean = await bcrypt.compare(password, user.accountData.passwordHash)
        if (result) return user
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false; //????!!!! < || >   Date??? date-fns/add DATE сравнение
        const isConfirmed = await usersRepository.updateConfirmation(user?._id)//
        if (!isConfirmed) return false
        return isConfirmed
    },

    async confirmNewCode(user: UserAccType) {
        const NewConfirmationCode = uuidv4()
        const NewExpirationDate = add(new Date, {hours: 1})
        await usersRepository.updateConfirmationCode(user, NewConfirmationCode, NewExpirationDate)
        await emailsManager.sendEmailConfirmationMessage(NewConfirmationCode, user.accountData.email)
    }

}


