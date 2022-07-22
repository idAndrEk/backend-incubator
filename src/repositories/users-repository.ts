import {
    UserDBPayloadType,
    UserRepositoryResponseType,
    UserResponseType
} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {PaginationType} from "../types/bloggersTypes";
import {ObjectId} from "mongodb";


export const usersRepository = {
    // async getCountDocument(): Promise<number> {
    //   //  usersCollection.countDocuments()
    // },
    async getAllUsers(page: number, pageSize: number): Promise<PaginationType<UserResponseType> | null> {
        const skip = (page - 1) * pageSize
        let allPostsCount = await usersCollection.countDocuments()
        let pagesCount = allPostsCount / pageSize
        let users = await usersCollection
            .find({})
            // .project<UserResponseType>({_id: 0})
            .skip(skip)
            .limit(pageSize)
            .toArray()    //User
        let allCount = await usersCollection.count({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            // items: users
            items: users.map(users => ({
                id: users._id.toString(),
                login: users.login
            }))
        }
    },

    async findUserById(id: string): Promise<UserRepositoryResponseType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        // const user = await usersCollection.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.login,
            passwordHash: user.passwordHash
        }
    },

    async createUser(newUser: UserDBPayloadType): Promise<UserResponseType | null> { //!!!
        const { login, passwordHash } = newUser
        const createdUser = await usersCollection.insertOne(newUser)
        if (!createdUser.acknowledged) {
            return null
        }
        return {
            // id: newUser.id,
            id: createdUser.insertedId.toString(),
            login,
            // passwordHash
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findUserByLogin(login: string): Promise<UserRepositoryResponseType | null> {
        const user = await usersCollection.findOne({login})
        if (!user) {
            return null
        }

        return {
            login: user.login,
            id: user._id.toString(),
            passwordHash: user.passwordHash
        }
    }
}