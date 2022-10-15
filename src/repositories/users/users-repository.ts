import {UserAccType} from "../../types/UsersTypes";
import {DevicesModelClass, UserModelClass} from "../db";
import {injectable} from "inversify";
import {DeviseType} from "../../types/divaseTypes";

@injectable()
export class UsersRepository {

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

    async addDevices(newDevices: DeviseType): Promise<DeviseType> {
        const devices = new DevicesModelClass(newDevices)
        await devices.save()
        return devices
    }
}



