import {
    UserAccType,
    UserDBPayloadType,
    UserRepositoryResponseType,
    UserResponseType
} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {PaginationType} from "../types/bloggersTypes";
import {ObjectId} from "mongodb";


export const usersRepository = {

    async getAllUsers(page: number, pageSize: number)/*: Promise<PaginationType<UserResponseType> | null>*/ {
        const skip = (page - 1) * pageSize
        let allCount = await usersCollection.countDocuments({})
        let users = await usersCollection
            .find({})
            .skip(skip)
            .limit(pageSize)
            .map(users => {
                return {id: users._id.toString(), login: users.accountData.userName}
            })
            .toArray()    //User
        return [users, allCount]
    },

    async findUserById(id: string): Promise<UserRepositoryResponseType | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.accountData.userName,
            passwordHash: user.accountData.passwordHash,
            email: user.accountData.email
        }
    },

    async createUser(newUser: UserAccType)/*Promise<UserAccType | null>*/ {
        // const { login, email/*, passwordHash*/ } = newUser
        return await usersCollection.insertOne(newUser)
        // if (!createdUser.acknowledged) {
        //     return null
        // }
        // return {
        //     id: createdUser.insertedId.toString(),
        //     login,
        // }
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
            login: user.accountData.userName,
            id: user._id.toString(),
            passwordHash: user.accountData.passwordHash,
            email: user.accountData.email
        }
    }
}