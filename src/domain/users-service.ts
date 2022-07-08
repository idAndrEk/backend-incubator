import {UsersTypes, UsersTypesPassword} from "../types/UsersTypes";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {PaginationType} from "../types/bloggersTypes";


export const usersService = {

    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UsersTypesPassword>> {
        return usersRepository.getAllUsers(page, pageSize)
    },

    async createUser(login: string, password: string): Promise<UsersTypes | null> {
        const passwordHash = await authService._generateHash(password)
        const newUser: UsersTypes = {
            id: new ObjectId(),
            login: login,
            passwordHash
        }
        const createdUser = await usersRepository.createUser(newUser)
        if (createdUser) {
            return createdUser
        }
        return null
    }
}



