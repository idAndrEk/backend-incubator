import {UserAccType, UserResponseType} from "../types/UsersTypes";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailsManager} from "../mail/emailsManager";

export const usersService = {

    async getAllUsers(page: number, pageSize: number)/*: Promise<PaginationType<UserResponseType> | null> */ {
        const usersData = await usersRepository.getAllUsers(page, pageSize)
        // console.log(usersData)
        return {
            "pagesCount": Math.ceil(Number(usersData[1]) / pageSize),
            "page": page,
            "pageSize": pageSize,
            "totalCount": Number(usersData[1]),
            "items": usersData[0]
        }
    },

    async findUserById(id: string): Promise<UserResponseType | null> {
        const result = await usersRepository.findUserById(id)
        if (!result) {
            return null
        }

        return {
            id: result.id,
            login: result.login,
            email: result.email
        }
    },

    async createUser(login: string, email: string, password: string)/*: Promise<UserAccType | null> */ {
        const passwordHash = await authService._generateHash(password)
        const user: UserAccType = {
            // _id: new ObjectId(),
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
        try {
            const createResult = await usersRepository.createUser(user)
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

    // async createUser(login: string, password: string): Promise<UserResponseType | null> {
    //     const passwordHash = await authService._generateHash(password)
    //     const newUser: UserDBPayloadType = {
    //         login,
    //         passwordHash
    //     }
    //     const createdUser = await usersRepository.createUser(newUser)
    //     if (createdUser) {
    //         return createdUser
    //     }
    //     return null
    // },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)
    }
}


