import {UserDBType, UserPayloadType, UserResponseType} from "../types/UsersTypes";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {authService} from "./auth-service";
import {PaginationType} from "../types/bloggersTypes";

export const usersService = {

    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UserResponseType> | null> {
        const users = await usersRepository.getAllUsers(page, pageSize)
        return users
    },

    // async findUserById(id: ObjectId): Promise<UserPayloadType | null> {
    async findUserById(id: string): Promise<UserPayloadType | null> {
        return await usersRepository.findUserById(id)
    },

    async createUser(login: string, password: string): Promise<UserResponseType | null> {
        const passwordHash = await authService._generateHash(password)
        const newUser: UserDBType = {
            id: new ObjectId(),
            login: login,
            passwordHash
        }
        const result = await usersRepository.createUser(newUser)
        return result
    },

    // async deleteUserById(id: ObjectId): Promise<boolean> {
    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)
    }

}


