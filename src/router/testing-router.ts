import {Router, Request, Response} from "express";
import {
        bloggersCollection,
        commentCollection,
        postCollection,
        tokenCollection,
        usersCollection
} from "../repositories/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await bloggersCollection.deleteMany({})
        await postCollection.deleteMany({})
        await commentCollection.deleteMany({})
        await usersCollection.deleteMany({})
        await tokenCollection.deleteMany({})
        return res.sendStatus(204)
    })

