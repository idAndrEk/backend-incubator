import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {
    authMiddlewareUser,
    checkIdParamMiddleware
} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/comments-validation";
import {allValidation} from "../middlewares/Validation";
import {commentsRepository} from "../repositories/comments-repository";

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

commentsRouter.put('/:id',
    checkIdParamMiddleware,
    authMiddlewareUser,
    commentValidation,
    allValidation,
    async (req: Request<{ id: string }>, res: Response) => {
        const comment = await commentsRepository.findCommentId(req.body.id) //!!!
        if (comment) {
            const id = req.params.id;
            const content = req.body.content;
            const result = await commentsService.updateComment(id, content);
            if (result) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(404)
            return
        }
        const errors = [];
        errors.push({message: 'Error commentId', field: 'commentId'})
        if (errors.length) {
            res.status(400).json({
                errorsMessages: errors
            })
        }
    })

commentsRouter.delete('/:id',
    checkIdParamMiddleware,
    authMiddlewareUser,
    async (req: Request<{ id: string }>, res: Response) => {
        const commentToDelet = await commentsService.findCommentId(req.params.id)
        if (!commentToDelet) {
            return res.sendStatus(404)
        }
        if (commentToDelet.userId != req.user?.id) {
            res.sendStatus(403)
        }
        const deleteCommentId = await commentsService.deleteComment(req.params.id)
        if (deleteCommentId) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

// commentsRouter.post('/',
//     authMiddlewareUser,
//     async (req: Request, res: Response) => {
//         const content = req.body.content;
//         const userId = req.body.userId;
//         const userLogin = req.body.userLogin;
//         // const addedAt = new Date().toString();
//         const newComment = await commentsService.createComment(content, userId, userLogin)
//         if (!newComment) {
//             res.status(404).send('Not found')
//         } else {
//             res.status(201).send(newComment)
//         }
//     })
