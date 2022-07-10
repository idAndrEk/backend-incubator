import {UserDBType, UserResponseType} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {PaginationType} from "../types/bloggersTypes";


export const usersRepository = {
    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UserResponseType> | null> {
        const skip = (page - 1) * pageSize
        let allPostsCount = await usersCollection.countDocuments()
        let pagesCount = allPostsCount / pageSize
        let posts = await usersCollection.find({}).skip(skip).limit(pageSize).toArray()
        let allCount = await usersCollection.count({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts.map(users => ({
                id: users.id,
                login: users.login
            }))
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
            login
        }
    }
}