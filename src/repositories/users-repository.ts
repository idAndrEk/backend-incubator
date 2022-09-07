import {UserAccType, UserDto} from "../types/UsersTypes";
import {UserModel} from "./db";

export const usersRepository = {

    async countComment(): Promise<number> {
        const count = await UserModel.countDocuments({})
        return count
    },

    async getAllUsers(page: number, pageSize: number): Promise<UserDto[]> {
        const user = UserModel
            .aggregate()
            .project({id: '$_id', login: '$accountData.userName', _id:0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        return user
    },

    async findUserById(id: string): Promise<UserAccType | null> {
        return UserModel.findById(id)
    },

    // async createUser(newUser: UserType): Promise<UserAccType> {
    //     return await usersCollection.insertOne(newUser)
    // },

    async createUser(newUser: UserAccType): Promise<UserAccType | null> {
        try {
            const user = new UserModel(newUser)
            return user.save()
        } catch (e) {
            return null
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        const user = await UserModel.findByIdAndDelete(id)
        if (user) return true
        return false
    },

    async findByLogin(login: string): Promise<UserAccType | null> {
        const byLogin = await UserModel.findOne({'accountData.userName': login})
        return byLogin
    },

    async findByEmail(email: string) {
        const byEmail = await UserModel.findOne({'accountData.email': email})
        return byEmail
    },

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await UserModel.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    },

    async updateConfirmation(id: string): Promise<boolean | null> {
        const result = await UserModel.updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    },

    async updateConfirmationCode(user: UserAccType, confirmationCode: string, expirationDate: Date) {
        const updateConfirm = await UserModel.findOneAndUpdate(user._id, {
            'emailConfirmation.confirmationCode': confirmationCode,
            'emailConfirmation.expirationDate': expirationDate
        })
        if (updateConfirm) return true
        return false
    }
}


// async getAllUsersByToken(user: UserAccType) {
//     return await UserModel.find({})
// }


// async saveRequestBD(ip: string, endpoint: string, date: number) {
//     return await requestIpData.countDocuments({
//         ip,
//         endpoint,
//         date
//     })
// }


