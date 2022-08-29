import {NextFunction, Request, Response} from "express";
import {InputType} from "../types/InputType";
import {requestIpData} from "../repositories/db";

export const requestInput = async (req: Request, res: Response, next: NextFunction) => {
    const input: InputType = {
        ip: req.ip,
        endpoint: req.url,
        date: +(new Date())
    }
    await requestIpData.insertOne(input)
    const startDate = +(new Date()) - 10000
    const count = await requestIpData.countDocuments({ // вынести в слой
        ip: req.ip,
        endpoint: req.url,
        date: {$gt: startDate}
    })
    if (count > 5) {
        res.sendStatus(429)
        return
    }
    return next()
}




