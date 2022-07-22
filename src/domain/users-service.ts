import {UserDBPayloadType, UserResponseType} from "../types/UsersTypes";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {PaginationType} from "../types/bloggersTypes";

export const usersService = {

    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UserResponseType> | null> {
        //count = get repo.count
        //rep get users()
        //total count =
        const users = await usersRepository.getAllUsers(page, pageSize)
        return users
    },

    async findUserById(id: string): Promise<UserResponseType | null> {
        const result = await usersRepository.findUserById(id)
        if (!result) {
            return null
        }

        return {
            id: result.id,
            login: result.login
        }
    },

    async createUser(login: string, password: string): Promise<UserResponseType | null> {
        const passwordHash = await authService._generateHash(password)
        const newUser: UserDBPayloadType = {
            // id: new ObjectId(),
            // login: login,
            login,
            passwordHash
        }
        const createdUser = await usersRepository.createUser(newUser)
        if (createdUser) {
            return createdUser
        }
        return null
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)
    }
}


