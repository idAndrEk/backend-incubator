import {UserAccType, UserResponseType} from "../types/UsersTypes";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailsManager} from "../mail/emailsManager";
import {PaginationType} from "../types/bloggersTypes";

export const usersService = {

    async getAllUsers(page: number, pageSize: number)/*: Promise<PaginationType<Omit<UserResponseType, 'email'>>>*/{ // поделить
        const usersData = await usersRepository.getAllUsers(page, pageSize)
        // console.log('getAllUsers',usersData)
        return {
            "pagesCount": Math.ceil(Number(usersData[1]) / pageSize),
            "page": page,
            "pageSize": pageSize,
            "totalCount": Number(usersData[1]),
            "items": usersData[0]
        }
    },

    async findUserById(id: string): Promise<UserResponseType | null> {
        const userById = await usersRepository.findUserById(id)
        if (!userById) {
            return null
        }
        return {
            id: userById._id.toString(),
            login: userById.accountData.userName,
            email: userById.accountData.email
        }
    },

    async createUser(login: string, email: string, password: string)/*: Promise<UserAccType | null> */ {
        const passwordHash = await authService._generateHash(password)
        const user: UserAccType = {
            _id: new ObjectId(),
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


