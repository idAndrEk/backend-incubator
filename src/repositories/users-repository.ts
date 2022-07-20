import {UserDBType, UserPayloadDbType, UserPayloadType, UserResponseType} from "../types/UsersTypes";
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

    async findUserById(id: string): Promise<UserPayloadType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        // const user = await usersCollection.findOne({_id: id})
        if (!user) {
            return null
        }
        return {
            id: user.id,
            login: user.login
        }
    },

    async createUser(newUser: UserPayloadDbType): Promise<UserResponseType| null> {
        const {login} = newUser
        const createUser = await usersCollection.insertOne(newUser)
        if (!createUser.acknowledged) {
            return null
        }
        return {
            // id: newUser.id,
            id: createUser.insertedId.toString(),
            // login: newUser.login
            login
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
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