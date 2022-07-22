import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {
    authMiddlewareUser,
    checkCommentIdParamMiddleware,
    checkIdParamMiddleware
} from "../middlewares/auth-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsService.findCommentId(req.params.id);
        if (!comment) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(comment)
        }
    })

commentsRouter.post('/',
    authMiddlewareUser,
    async (req: Request, res: Response) => {
        const content = req.body.content;
        const userId = req.body.userId;
        const userLogin = req.body.userLogin;
        // const addedAt = new Date().toString();
        const newComment = await commentsService.createComment(content, userId, userLogin)
        if (!newComment) {
            res.status(404).send('Not found')
        } else {
            res.status(201).send(newComment)
        }
    })

// commentsRouter.put('/:commentId',

commentsRouter.delete('/:id',
    checkIdParamMiddleware,
    authMiddlewareUser,
    async (req: Request<{id: string}>, res: Response) => {
        const deleteCommentId = await commentsService.deleteComment(req.params.id)
        if (deleteCommentId) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

