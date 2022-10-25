import {UserAccType, UserResponse} from "../types/UsersTypes";
import {UsersRepository} from "../repositories/users/users-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailAdapter} from "../adapters/email-adapter";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import {jwtRepository} from "../repositories/jwt-repository";
import {jwtService} from "../composition-root";
import {injectable} from "inversify";

@injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository) {
    }

    async createUser(login: string, email: string, password: string): Promise<UserResponse | null> {
        const passwordHash = await bcrypt.hash(password, 10)
        const user: UserAccType = {
            _id: new ObjectId(),
            accountData: {
                userName: login,
                email,
                passwordHash,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1}),
                isConfirmed: false
            }
        }
        const newUserDB = await this.usersRepository.createUser(user)
        if (!newUserDB) return null
        await emailAdapter.sendEmailConfirmationMessage(user.emailConfirmation.confirmationCode, user.accountData.email)
        const userResponse = {
            id: user._id,
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
        if (userResponse) return userResponse
        return null
    }

    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id);
    }

    async getUserByLogin(login: string): Promise<UserAccType | null> {
        return await this.usersRepository.findByLogin(login);
    }

    async getUserByEmail(email: string): Promise<UserAccType | null> {
        return await this.usersRepository.findByEmail(email);
    }

    async confirmEmail(code: string): Promise<boolean> {
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        const isConfirmed = await this.usersRepository.updateConfirmation(user?.id)
        if (!isConfirmed) return false
        return isConfirmed
    }

    async confirmNewCode(user: UserAccType) {
        const NewConfirmationCode = uuidv4()
        const NewExpirationDate = add(new Date, {hours: 1})
        await this.usersRepository.updateConfirmationCode(user, NewConfirmationCode, NewExpirationDate)
        await emailAdapter.sendEmailConfirmationMessage(NewConfirmationCode, user.accountData.email)
    }

    async checkCredential(userId: string): Promise<UserAccType | null> {
        const user = await this.usersRepository.findByLogin(userId)
        if (!user) return null
        return user
    }

    async checkPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash)
    }

    async createAccessToken(login: string) {
        const user = await this.checkCredential(login)
        if (!user) return null
        const token = await jwtService.createAccessJWT(user)
        return token
    }

    async createRefreshToken(login: string, oldRefreshToken: string) {
        const user = await this.checkCredential(login)
        if (!user) return null
        const token = await jwtService.createRefreshJWT(user)
        await jwtRepository.addTokenToDB(oldRefreshToken)
        return token
    }

    async createDevicesIdRefreshToken(userId: string, deviceId: string) {
        const user = await this.checkCredential(userId)
        if (!user) return null
        const token = await jwtService.createDevicesIdRefreshJWT(user, deviceId)
        await jwtRepository.addTokenToDB(token)
        return token
    }

    async devicesIdDb() {
        const devicesId = uuidv4()
        return devicesId
    }

    async addDevices(ip: string, title: string, devicesId: string, userId: string, issuedAt: Date, expireTime: Date): Promise<any> {
        const devices = {
            ip: ip,
            title: title,
            lastActiveDate: new Date,
            deviceId: devicesId,
            userId: userId,
            issuedAt,
            expireTime
        }
        await this.usersRepository.addDevices(devices)
        // return devices.deviceId
    }
}


