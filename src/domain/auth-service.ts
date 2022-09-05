import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";
import {UserAccType} from "../types/UsersTypes";
import add from "date-fns/add";
import {v4 as uuidv4} from "uuid";
import {emailsManager} from "../mail/emailsManager";
import {jwtService} from "../application/jwt-service";
import {jwtRepository} from "../repositories/jwt-repository";


export const authService = {

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async checkCredentials(login: string, password: string)/*: Promise<UserResponseType | null> */ {
        const user = await usersService.findUserByLogin(login)
        if (!user) return null
        const result: boolean = await bcrypt.compare(password, user.accountData.passwordHash)
        if (result) return user
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false; //????!!!! < || >   Date??? date-fns/add DATE сравнение
        const isConfirmed = await usersRepository.updateConfirmation(user?.id)//
        if (!isConfirmed) return false
        return isConfirmed
    },

    async confirmNewCode(user: UserAccType) {
        const NewConfirmationCode = uuidv4()
        const NewExpirationDate = add(new Date, {hours: 1})
        await usersRepository.updateConfirmationCode(user, NewConfirmationCode, NewExpirationDate)
        await emailsManager.sendEmailConfirmationMessage(NewConfirmationCode, user.accountData.email)
    },

    async checkCredential(login:string): Promise<UserAccType | null>{
        const user = await usersRepository.findByLogin(login)
        if (!user) return null
        return user
    },

    async checkPassword (password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    },

    async createAccessToken(login: string) {
        const user = await this.checkCredential(login)
        if (!user) return null
        const token = await jwtService.createAccessJWT(user!)
        return token
    },

    async createRefreshToken(login: string) {
        const user = await this.checkCredential(login)
        if (!user) return null
        const token = await jwtService.createRefreshJWT(user!)
        await jwtRepository.addTokenToDB(token)
        return token
    },
}


