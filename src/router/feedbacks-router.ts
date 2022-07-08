// import {Router, Request, Response} from "express";
// import {authMiddleware, authMiddlewareUser} from "../middlewares/auth-middleware";
//
//
// export const feedbacksRouter = Router({})
//
// feedbacksRouter
//     .post('/', authMiddlewareUser,
//         async (req: Request, res: Response) => {
//             const newUser = await feedbacksService.sendFeedback(req.body.comment, req.user!._id)
//             res.status(201).send(newUser)
//         })
//     .get('/', async (req: Request, res: Response) => {
//         const user = await feedbacksService
//             .allFeedback()
//         res.send(user)
//     })