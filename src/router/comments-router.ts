import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";


export const commentsRouter = Router({})

commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const comment = await commentsService.findCommentId(req.params.id);
        if (!comment) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(comment)
        }
    })