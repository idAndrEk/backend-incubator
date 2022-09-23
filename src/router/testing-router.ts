import {Router, Request, Response} from "express";
import {
    BloggerModelClass,
    CommentModelClass, InputModelClass, LikeModelClass,
    PostModelClass,
    TokenModelClass,
    UserModelClass,
} from "../repositories/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await BloggerModelClass.deleteMany({})
        await PostModelClass.deleteMany({})
        await CommentModelClass.deleteMany({})
        await UserModelClass.deleteMany({})
        await TokenModelClass.deleteMany({})
        await InputModelClass.deleteMany({})
        await LikeModelClass.deleteMany({})
        return res.sendStatus(204)
    })

