import {injectable} from "inversify";
import {DevicesModelClass} from "./db";
import {DevicesDtoType, DevicesType} from "../types/divaseTypes";

@injectable()
export class DevicesRepository {

    async getDevices(userId: string): Promise<DevicesDtoType[]> {
        const devices = await DevicesModelClass.find({userId})
        return devices
    }

    async getDevice(deviceId: string): Promise<DevicesDtoType | null> {
        const devices = await DevicesModelClass.findOne({deviceId: deviceId})
        if (!devices) return null
        return devices
    }

    async deleteSessionsDb(userId: string, devicesId: string): Promise<boolean> {
        const deleteResult = await DevicesModelClass.deleteMany({userId: userId, deviceId: {$ne: devicesId}})
        if (deleteResult) return true
        return false
    }

    async deleteSessionDb(userId: string, devicesId: string): Promise<boolean> {
        const deleteResult = await DevicesModelClass.deleteOne({userId: userId, deviceId: devicesId})
        if (deleteResult) return true
        return false
    }

    async updateLastActiveDate(userId: string, deviceId: string) {
        return DevicesModelClass.updateOne({userId, deviceId}, {$set: {lastActiveDate: new Date()}});
    }
}