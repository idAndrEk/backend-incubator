import {injectable} from "inversify";
import {DevicesRepository} from "../repositories/devices-repository";
import {DevicesType} from "../types/divaseTypes";

@injectable()
export class DevicesService {
    constructor(protected devicesRepository: DevicesRepository) {
    }

    async getDevices(login: string): Promise<DevicesType[]> {
        const devices = await this.devicesRepository.getDevices(login)
        // console.log(devices)
        return devices.map(devicesAll => ({
            ip: devicesAll.ip,
            title: devicesAll.title,
            lastActiveDate: devicesAll.lastActiveDate,
            deviceId: devicesAll.deviceId
        }))
    }
}