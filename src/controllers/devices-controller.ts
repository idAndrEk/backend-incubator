import {injectable} from "inversify";
import {Request, Response} from "express";
import {DevicesService} from "../domain/devices-service";

@injectable()
export class DevicesController {

    constructor(protected devicesService: DevicesService) {
    }

    async getDevices(req: Request, res: Response) {
        try {
            const login = req.user.login
            const devices = await this.devicesService.getDevices(login)
            return res.status(200).send(devices)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}