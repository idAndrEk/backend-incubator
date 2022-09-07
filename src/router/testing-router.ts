import {Router, Request, Response} from "express";
import {
    BloggerModel,
    CommentModel, InputModel,
    PostModel,
    TokenModel,
    UserModel,
} from "../repositories/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data',
    async (req: Request, res: Response) => {
        await BloggerModel.deleteMany({})
        await PostModel.deleteMany({})
        await CommentModel.deleteMany({})
        await UserModel.deleteMany({})
        await TokenModel.deleteMany({})
        await InputModel.deleteMany({})
        return res.sendStatus(204)
    })

