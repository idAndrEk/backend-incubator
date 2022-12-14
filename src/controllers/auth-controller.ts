import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {jwtService} from "../composition-root";
import {DevicesService} from "../domain/devices-service";
import {DevicesRepository} from "../repositories/devices-repository";
import {emailAdapter} from "../adapters/email-adapter";

@injectable()
export class AuthController {

    constructor(protected usersService: UsersService,
                protected devicesService: DevicesService,
                protected devicesRepository: DevicesRepository) {
    }

    async login(req: Request, res: Response) {
        try {
            const devicesId = await this.usersService.generationUUID()
            const accessToken = await this.usersService.createAccessToken(req?.user.accountData.login)
            const refreshToken = await this.usersService.createDevicesIdRefreshToken(req?.user, devicesId)
            const ip = req.ip
            const title = req.headers["user-agent"]
            const userId = req.user._id.toString()
            const payload = await jwtService.deviceIdRefreshJToken(refreshToken as string)
            const issuedAt = payload?.iat
            const expireTime = payload?.exp
            const devicesDB = await this.usersService.addDevices(ip, title as string, devicesId, userId, issuedAt!, expireTime!)
            return res.status(200).cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
            }).send({accessToken})
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) return res.sendStatus(401)
            const payload = await jwtService.deviceIdRefreshJToken(refreshToken)
            const userId = payload?.userId
            const devicesId = payload?.deviceId
            const deleteDevicesId = await this.devicesService.deleteSession(userId as string, devicesId as string)
            res.clearCookie('refreshToken')
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        try {
            const email = req.body.email
            const userEmail = await this.usersService.getUserByEmail(email)

            if (!userEmail) {
                // const emailNotRegistration = await this.usersService.generationUUID()
                // const codeRecoverySendMessage = await emailAdapter.sendEmailRecoveryMessage(emailNotRegistration.toString(), email)
                return res.sendStatus(204)
            }
            const code = await this.usersService.generationCodeRecovery(userEmail!.accountData.email, userEmail!._id.toString())
            await emailAdapter.sendEmailRecoveryMessage(code.toString(), userEmail!.accountData.email)
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async newPassword(req: Request, res: Response) {
        try {
            const recoveryCode = req.body.recoveryCode
            const codeRecoveryBD = await this.usersService.confirmCodeRecovery(recoveryCode)
            if (!codeRecoveryBD) return res.status(404).send('Wrong password')
            const userId = codeRecoveryBD._id
            const password = req.body.newPassword
            const newPassword = await this.usersService.newPasswordRecovery(userId.toString(), password)
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const oldRefreshToken = req.cookies.refreshToken
            const payload = await jwtService.deviceIdRefreshJToken(oldRefreshToken as string)
            const userId = payload?.userId
            const devicesId = payload?.deviceId
            const updateDateDevicesId = await this.devicesService.updateLastActiveDate(userId as string, devicesId as string)
            const accessToken = await this.usersService.createAccessToken(req.user.login)
            const refreshToken = await this.usersService.createRefreshToken(req.user.login, oldRefreshToken, devicesId as string)
            return res.status(200).cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
            }).send({accessToken})
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async me(req: Request, res: Response) {
        try {
            const user = {
                email: req.user.accountData.email,
                login: req.user.accountData.userName,
                userId: req.user.id
            }
            return res.status(200).send(user)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async registration(req: Request, res: Response) {
        try {
            const userLogin = await this.usersService.getUserByLogin(req.body.login)
            const userEmail = await this.usersService.getUserByEmail(req.body.email)
            if (userLogin) return res.status(400).send({
                errorsMessages: [{
                    message: "User already exists",
                    field: "login"
                }]
            })

            if (userEmail) return res.status(400).send({
                errorsMessages: [{
                    message: "Mail already exists",
                    field: "email"
                }]
            })

            const user = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
            if (user) return res.sendStatus(204)
            return res.sendStatus(400)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async registration??onfirmation(req: Request, res: Response) {
        try {
            const result = await this.usersService.confirmEmail(req.body.code)
            if (result) {
                return res.sendStatus(204)
            } else {
                return res.status(400).send({
                    errorsMessages: [{
                        message: "Invalid confirmation code",
                        field: "code"
                    }]
                })
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        try {
            const user = await this.usersService.getUserByEmail(req.body.email)
            if (!user) {
                return res.status(400).send({errorsMessages: [{message: "Mail does not exist", field: "email"}]})
            }
            if (user.emailConfirmation.isConfirmed) {
                return res.status(400).send({errorsMessages: [{message: "User activated adapters", field: "email"}]})
            }
            await this.usersService.confirmNewCode(user)
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}
