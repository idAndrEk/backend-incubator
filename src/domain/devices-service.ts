import {injectable} from "inversify";
import {DevicesRepository} from "../repositories/devices-repository";
import {DevicesType} from "../types/divaseTypes";

@injectable()
export class DevicesService {
    constructor(protected devicesRepository: DevicesRepository) {
    }

    async getDevices(userId: string): Promise<DevicesType[]> {
        const devices = await this.devicesRepository.getDevices(userId)
        // console.log(devices)
        return devices.map(devicesAll => ({
            ip: devicesAll.ip,
            title: devicesAll.title,
            lastActiveDate: devicesAll.lastActiveDate,
            deviceId: devicesAll.deviceId
        }))
    }

    async deleteSessions(userId: string, devicesId: string): Promise<boolean> {
        return await this.devicesRepository.deleteSessionsDb(userId, devicesId)
    }

    async deleteSession(devicesId: string): Promise<boolean> {
        return await this.devicesRepository.deleteSessionDb(devicesId)
    }

}