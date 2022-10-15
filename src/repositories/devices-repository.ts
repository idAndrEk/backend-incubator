import {injectable} from "inversify";
import {DevicesModelClass} from "./db";
import {DeviseType} from "../types/divaseTypes";

@injectable()
export class DevicesRepository {

    async getDevices(): Promise<DeviseType[]> {
        const devices = await DevicesModelClass.find({})
        return devices
    }
}