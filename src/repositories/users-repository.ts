import {UsersTypes, UsersTypesPassword} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {PaginationType} from "../types/bloggersTypes";


export const usersRepository = {
    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UsersTypesPassword>> {
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

    async createUser(newUser: UsersTypes): Promise<UsersTypes | null> {
        const {login, passwordHash} = newUser
        const result = await usersCollection.insertOne(newUser)
        if (!result.acknowledged) {
            return null
        }
        return {
            id: newUser.id,
            login,
            passwordHash
        }
    }
}