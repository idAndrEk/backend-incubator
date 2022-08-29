import {NextFunction, Request, Response} from "express";
import {InputType} from "../types/InputType";
import {requestIpData} from "../repositories/db";

export const requestInput = async (req: Request, res: Response, next: NextFunction) => { //ip endpoint data !!! add BD
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


// const inputArr = []
// inputArr.push(input)
// const ipInput = inputArr.filter(i => i.ip === req.ip)
// const endpointInput = ipInput.filter(e => e.endpoint === req.url)
// const countIpArr = endpointInput.filter(c => c.data > (+(new Date()) - 10000))
// if (countIpArr.length > 5) {
//     return res.sendStatus(429)
// }

// const ipInput = requestIpData.find({ip: req.ip})
// const endpointInput = requestIpData.find({endpoint: req.url})
// const dataInput = requestIpData.find({data: new Date()})