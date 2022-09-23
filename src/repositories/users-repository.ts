import {UserAccType, UserResponse} from "../types/UsersTypes";
import {UserModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {

    async countComment(): Promise<number> {
        const count = await UserModelClass.countDocuments({})
        return count
    }

    async getUsers(page: number, pageSize: number): Promise<UserResponse[]> {
        const user = UserModelClass
            .aggregate()
            .project({id: '$_id', login: '$accountData.userName', _id:0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        return user
    }

    async getUser(id: string): Promise<UserAccType | null> {
        return UserModelClass.findById(id)
    }

    // async createUser(newUser: UserType): Promise<UserAccType> {
    //     return await usersCollection.insertOne(newUser)
    // },

    async createUser(newUser: UserAccType): Promise<UserAccType | null> {
        try {
            const user = new UserModelClass(newUser)
            return user.save()
        } catch (e) {
            return null
        }
    }

    async deleteUserById(id: string): Promise<boolean> {
        const user = await UserModelClass.findByIdAndDelete(id)
        if (user) return true
        return false
    }

    async findByLogin(login: string): Promise<UserAccType | null> {
        const byLogin = await UserModelClass.findOne({'accountData.userName': login})
        return byLogin
    }

    async findByEmail(email: string) {
        const byEmail = await UserModelClass.findOne({'accountData.email': email})
        return byEmail
    }

    async findUserByConfirmationCode(emailConfirmationCode: string) {
        const user = await UserModelClass.findOne({'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    }

    async updateConfirmation(id: string): Promise<boolean | null> {
        const result = await UserModelClass.updateOne({id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }

    async updateConfirmationCode(user: UserAccType, confirmationCode: string, expirationDate: Date) {
        const updateConfirm = await UserModelClass.findOneAndUpdate(user._id, {
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


