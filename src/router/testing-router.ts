import {Router, Request, Response} from "express";
import {bloggersCollection, commentCollection, postCollection, usersCollection} from "../repositories/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await bloggersCollection.deleteMany({})
        await postCollection.deleteOne({})
        await commentCollection.deleteMany({})
        await usersCollection.deleteMany({})
        return res.sendStatus(204)
    })

