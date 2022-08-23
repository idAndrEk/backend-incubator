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
            .toArray()
        return [users, allCount]
    },

    async findUserById(id: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({_id: new ObjectId(id)})
    },

    async createUser(newUser: UserAccType) {
        return await usersCollection.insertOne(newUser)
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findUserByLogin(login: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({login})
    },

    async findByLogin(login: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({'accountData.userName': login})
    },

    async findByEmail(email: string) {
        return await usersCollection.findOne({'accountData.email': email})
    },

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        // console.log("findUserByConfirmationCode", user)
        return user
    },

    async updateConfirmation(_id: ObjectId) {
        const result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
}