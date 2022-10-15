import {injectable} from "inversify";
import {DevicesRepository} from "../repositories/devices-repository";
import {DeviseType} from "../types/divaseTypes";

@injectable()
export class DevicesService {
    constructor(protected devicesRepository: DevicesRepository) {
    }

    async getDevices(): Promise<DeviseType[]> {
        const devices = await this.devicesRepository.getDevices()
        // console.log(devices)
        return devices.map(devicesAll => ({
            ip: devicesAll.ip,
            title: devicesAll.title,
            lastActiveDate: devicesAll.lastActiveDate,
            deviceId: devicesAll.deviceId
        }))
    }
}