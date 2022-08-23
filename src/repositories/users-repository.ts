import {UserAccType} from "../types/UsersTypes";
import {usersCollection} from "./db";
import {ObjectId} from "mongodb";


export const usersRepository = {

    async getAllUsers(page: number, pageSize: number) {
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

    async findUserById(id: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)})
        // const user = await usersCollection.findOne({_id: new ObjectId(id)})
        // if (!user) {
        //     return null
        // }
        // console.log(user)
        // return {
        //     id: user._id.toString(),
        //     login: user.accountData.userName,
        //     // passwordHash: user.accountData.passwordHash,
        //     email: user.accountData.email
        // }
    },

    async createUser(newUser: UserAccType) {
        return await usersCollection.insertOne(newUser)
        // const { login, email/*, passwordHash*/ } = newUser
        // return await usersCollection.insertOne(newUser)
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

    async findUserByLogin(login: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({login})
    },

    async findByLogin(byLogin: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({$or: [{'accountData.userName': byLogin}]})
    },

    async findOrEmail(byEmail: string) {
        return  await usersCollection.findOne({$or: [{'accountData.email': byEmail}]})
        // return await usersCollection.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.userName': loginOrEmail}]})
    },

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    },

    async updateConfirmation(_id: ObjectId) {
        const result = await usersCollection
            .updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
}