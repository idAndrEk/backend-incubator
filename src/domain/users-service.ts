import {PaginationUserType, UserAccType, UserType} from "../types/UsersTypes";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailsManager} from "../mail/emailsManager";

export const usersService = {

    async getAllUsers(page: number, pageSize: number): Promise<Omit<PaginationUserType, "email">> { // поделить
        const usersData = await usersRepository.getAllUsers(page, pageSize)
        const pagesCount = Math.ceil(await usersRepository.countComment() / pageSize)
        const totalCount = await usersRepository.countComment()
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": usersData
        }
    },

    async findUserById(id: string): Promise<UserType | null> {
        const userById = await usersRepository.findUserById(id)
        if (!userById) {
            return null
        }
        return {
            id: userById.id,
            login: userById.accountData.userName,
            email: userById.accountData.email
        }
    },

    async createUser(login: string, email: string, password: string)/*: Promise<UserAccType | null> */ {
        const passwordHash = await authService._generateHash(password)
        const user: UserAccType = {
            id: uuidv4(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1}),
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(user)
        try {
            // console.log('createUser', user)
            if (createResult.acknowledged) {
                return await emailsManager.sendEmailConfirmationMessage(user.emailConfirmation.confirmationCode, user.accountData.email)
            } else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    },

    async findUserByLogin(login: string): Promise<UserAccType | null> {
        return await usersRepository.findByLogin(login);
    },

    async findUserByEmail(email: string): Promise<UserAccType | null> {
        return await usersRepository.findByEmail(email);
    },

    async logout(refreshToken: string) {
        const token = await usersRepository.logout(refreshToken);
        return token;
    }
}


