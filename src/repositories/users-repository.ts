import {UserAccType, UserDto} from "../types/UsersTypes";
import {usersCollection} from "./db";

export const usersRepository = {

    async countComment(): Promise<number> {
        return await usersCollection.countDocuments({})
    },

    async getAllUsers(page: number, pageSize: number): Promise<UserDto[]> {
        return usersCollection
            .find({}, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .map(users => {
                return {id: users.id, login: users.accountData.userName}
            })
            .toArray()
    },

    async findUserById(id: string): Promise<UserAccType | null> {
        return await usersCollection.findOne({id})
    },

    // async createUser(newUser: UserType): Promise<UserAccType> {
    //     return await usersCollection.insertOne(newUser)
    // },

    async createUser(newUser: UserAccType) {
        return await usersCollection.insertOne(newUser)
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
        return result.deletedCount === 1
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

    async updateConfirmation(id: string): Promise<boolean | null> {
        const result = await usersCollection.updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(user: UserAccType, confirmationCode: string, expirationDate: Date) {
        return await usersCollection.findOneAndUpdate({id: user.id}, {
            $set: {
                'emailConfirmation.confirmationCode': confirmationCode,
                'emailConfirmation.expirationDate': expirationDate
            }
        })
    },

    async getAllUsersByToken(user: UserAccType) {
        return await usersCollection.find({})
    }
}


// async saveRequestBD(ip: string, endpoint: string, date: number) {
//     return await requestIpData.countDocuments({
//         ip,
//         endpoint,
//         date
//     })
// }


