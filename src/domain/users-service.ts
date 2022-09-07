import {PaginationUserType, UserAccType, UserDto} from "../types/UsersTypes";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailsManager} from "../mail/emailsManager";
import {ObjectId} from "mongodb";

export const usersService = {

    async getAllUsers(page: number, pageSize: number): Promise<Omit<PaginationUserType, "email">> {
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

    async findUserById(id: string): Promise<UserAccType | null> {
        const user = await usersRepository.findUserById(id)
        return user
    },

    async createUser(login: string, email: string, password: string): Promise<UserDto | null> {
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
        const newUserDB = await usersRepository.createUser(user)
        if (!newUserDB) return null
        await emailsManager.sendEmailConfirmationMessage(user.emailConfirmation.confirmationCode, user.accountData.email)
        const userDto = {
            // id: user._id.toString(),
            id: user._id.toString(),
            login: user.accountData.userName
        }
        console.log(userDto)
        if (userDto) return userDto
        return null
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id);
    },

    async findUserByLogin(login: string): Promise<UserAccType | null> {
        return await usersRepository.findByLogin(login);
    },

    async findUserByEmail(email: string): Promise<UserAccType | null> {
        return await usersRepository.findByEmail(email);
    }

}


