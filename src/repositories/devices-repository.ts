import {injectable} from "inversify";
import {DevicesModelClass} from "./db";
import {DevicesType} from "../types/divaseTypes";

@injectable()
export class DevicesRepository {

    async getDevices(userId: string): Promise<DevicesType[]> {
        const devices = await DevicesModelClass.find({userId})
        return devices
    }

    async deleteSessionsDb(userId: string, devicesId: string): Promise<boolean> {
        const deleteResult = await DevicesModelClass.deleteMany({userId, deviceId:{$ne: devicesId}})
        if (deleteResult) return true
        return false
    }

    async deleteSessionDb(devicesId: string): Promise<boolean> {
        const deleteResult = await DevicesModelClass.findByIdAndDelete({devicesId})
        if (deleteResult) return true
        return false
    }

}