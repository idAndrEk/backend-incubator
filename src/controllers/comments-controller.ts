import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService) {
    }

    async getComment(req: Request, res: Response) {
        const comment = await this.commentsService.findCommentId(req.params.id);
        if (!comment) {
            return res.status(404).send('Not found')
        } else {
            return res.status(200).send(comment)
        }
    }

    async updateComment(req: Request<{ id: string }>, res: Response) {
        const commentToUpdate = await this.commentsService.findCommentId(req.params.id)
        if (commentToUpdate!.userId != req.user?.id) {
            return res.sendStatus(403)
        }
        const comment = await this.commentsService.findCommentId(req.params.id)
        if (comment) {
            const id = req.params.id;
            const content = req.body.content;
            const result = await this.commentsService.updateComment(id, content);
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
    }

    async addLikeToComment(req: Request, res: Response) {
        try {
            const comment = await this.commentsService.findCommentId(req.params.id);
            if (!comment) return res.sendStatus(404)
            const commentId = req.params.id;
            const userId = req.user.id;
            const login = req.user.accountData.userName;
            const {likeStatus} = req.body;
            await this.commentsService.addLikeToComment(commentId, userId, login, likeStatus)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async deleteComment(req: Request<{ id: string }>, res: Response) {
        const commentToDelete = await this.commentsService.findCommentId(req.params.id)
        if (commentToDelete!.userId != req.user?.id) {
            return res.sendStatus(403)

        }
        const deleteCommentId = await this.commentsService.deleteComment(req.params.id)
        if (deleteCommentId) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }
}