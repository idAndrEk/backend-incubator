import {NextFunction, Request, Response} from "express";
import {InputType} from "../types/InputType";
import {InputModel} from "../repositories/db";

export const requestInput = async (req: Request, res: Response, next: NextFunction) => {
    const input: InputType = {
        ip: req.ip,
        endpoint: req.url,
        date: +(new Date())
    }
    await InputModel.insertMany(input)
    const startDate = +(new Date()) - 10000
    const count = await InputModel.countDocuments({ // вынести в слой
    // const count  = await usersRepository.saveRequestBD({
        ip: req.ip,
        endpoint: req.url,
        date: {$gt: startDate}
    })
    if (count > 5) {
        return res.sendStatus(429)
    }
    return next()
}




