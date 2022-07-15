import {UserDBType, UserPayloadType, UserResponseType} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {PaginationType} from "../types/bloggersTypes";
import {ObjectId} from "mongodb";


export const usersRepository = {
    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UserResponseType> | null> {
        const skip = (page - 1) * pageSize
        let allPostsCount = await usersCollection.countDocuments()
        let pagesCount = allPostsCount / pageSize
        let users = await usersCollection
            .find({})
            .project<UserResponseType>({_id: 0})
            .skip(skip)
            .limit(pageSize)
            .toArray()    //User
        let allCount = await usersCollection.count({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            items: users
            // items: users.map(users => ({
            //     id: users.id,
            //     login: users.login
            // }))
        }
    },

    // async findUserById(id: ObjectId): Promise<UserPayloadType | null> {
    async findUserById(id: string): Promise<UserPayloadType | null> {
        const user = await usersCollection.findOne({id: new ObjectId(id)})
        // const user = await usersCollection.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            id: user.id,
            login: user.login
        }
    },

    async createUser(newUser: UserDBType): Promise<UserResponseType | null> {
        const {login} = newUser
        const createUser = await usersCollection.insertOne(newUser)
        if (!createUser.acknowledged) {
            return null
        }
        return {
            id: newUser.id,
            login: newUser.login
        }
    },

    // async deleteUserById(id: ObjectId): Promise<boolean> {
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: new ObjectId(id)})
        //     const result = await usersCollection.deleteOne({_id: id})
        return result.deletedCount === 1
    },

    async findUserByLogin(login: string): Promise<UserDBType | null> {
        const user = usersCollection.findOne({login})
        if (!user) {
            return null
        }
        return user
    }
}