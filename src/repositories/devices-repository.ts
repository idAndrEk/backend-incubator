import {injectable} from "inversify";
import {DevicesModelClass} from "./db";
import {DevicesType} from "../types/divaseTypes";

@injectable()
export class DevicesRepository {

    async getDevices(login: string): Promise<DevicesType[]> {
        const devices = await DevicesModelClass.find({login})
        return devices
    }
}