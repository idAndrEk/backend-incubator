import {injectable} from "inversify";
import {Request, Response} from "express";
import {DevicesService} from "../domain/devices-service";
import {jwtService} from "../composition-root";
import {UsersQueryRepository} from "../repositories/users/usersQueryRepository";

@injectable()
export class DevicesController {

    constructor(protected devicesService: DevicesService,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async getDevices(req: Request, res: Response) {
        try {
            if (!req.cookies.refreshToken) return res.sendStatus(401)
            const payload = await jwtService.deviceIdRefreshJToken(req.cookies.refreshToken)
            console.log(payload)
            const userId = payload?.userId
            const devices = await this.devicesService.getDevices(userId!)
            return res.status(200).send(devices)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteSessions(req: Request, res: Response) {
        try {
            if (!req.cookies.refreshToken) return res.sendStatus(401)
            const payload = await jwtService.deviceIdRefreshJToken(req.cookies.refreshToken)
            if (!payload) return res.sendStatus(401)
            const userId = payload.userId
            const deviceId = payload.deviceId
            const isDeleted = await this.devicesService.deleteSessions(userId, deviceId)
            if (isDeleted) return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteSession(req: Request, res: Response) {
        try {
            if (!req.cookies.refreshToken) return res.sendStatus(401)
            const payload = await jwtService.deviceIdRefreshJToken(req.cookies.refreshToken)
            if (!payload) return res.sendStatus(401)
            const userId = payload.userId
            const userIdDb = await this.usersQueryRepository.getUser(userId)
            if (!userIdDb) return res.sendStatus(403)
            const deviceId = req.params.id
            const isDeleted = await this.devicesService.deleteSession(deviceId)
            if (isDeleted) return res.sendStatus(204)
                    } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}