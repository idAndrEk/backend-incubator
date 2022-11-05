import {NextFunction, Request, Response} from "express";
import {InputType} from "../types/InputTypes";
import {InputModelClass} from "../repositories/db";

export const requestInput = async (req: Request, res: Response, next: NextFunction) => {
    const input: InputType = {
        ip: req.ip,
        endpoint: req.url,
        date: +(new Date())
    }
    // await InputModelClass.insertMany(input)
    const startDate = +(new Date()) - 10000
    const count = await InputModelClass.countDocuments({
        ip: req.ip,
        endpoint: req.url,
        date: {$gt: startDate}
    })
    if (count > 4) {
        return res.sendStatus(429)
    }
    await InputModelClass.insertMany(input)
    return next()
}




