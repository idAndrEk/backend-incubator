import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {authMiddlewareUser} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/comments-validation";
import {allValidation} from "../middlewares/ValidationError";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const comment = await commentsService.findCommentId(req.params.id);
        if (!comment) {
            return res.status(404).send('Not found')
        } else {
            return res.status(200).send(comment)
        }
    })

commentsRouter.put('/:id',
    checkIdParamMiddleware,
    authMiddlewareUser,
    commentValidation,
    allValidation,
    async (req: Request<{ id: string }>, res: Response) => {
        const commentToUpdate = await commentsService.findCommentId(req.params.id)
        if (commentToUpdate!.userId != req.user?.id) {
            return res.sendStatus(403)
        }
        const comment = await commentsService.findCommentId(req.params.id)
        if (comment) {
            console.log(comment)
            const id = req.params.id;
            const content = req.body.content;
            const result = await commentsService.updateComment(id, content);
            if (result) {
                res.sendStatus(204)
                return
            }
            return res.sendStatus(404)
        }
        const errors = [];
        errors.push({message: 'Error commentId', field: 'commentId'})
        if (errors.length) {
            res.status(404).json({
                errorsMessages: errors
            })
        }
    })

commentsRouter.delete('/:id',
    checkIdParamMiddleware,
    authMiddlewareUser,
    async (req: Request<{ id: string }>, res: Response) => {
        const commentToDelete = await commentsService.findCommentId(req.params.id)
        if (commentToDelete!.userId != req.user?.id) {
            return res.sendStatus(403)

        }
        const deleteCommentId = await commentsService.deleteComment(req.params.id)
        if (deleteCommentId) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    })


