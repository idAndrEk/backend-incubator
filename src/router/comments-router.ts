import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {checkCommentIdParamMiddleware, checkIdParamMiddleware} from "../middlewares/auth-middleware";

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

commentsRouter.delete('/:commentId',
    checkCommentIdParamMiddleware,
    async (req: Request, res: Response) => {
        const deleteCommentId = await commentsService.deleteComment(req.params.id)
        if (deleteCommentId) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

