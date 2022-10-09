import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {CommentsQueryRepository} from "../repositories/comments/commentsQueryRepository";

@injectable()
export class CommentsController {

    constructor(protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepository) {}

    async getComment(req: Request, res: Response) {
        try {
            const comment = await this.commentsQueryRepository.getComment(req.params.id, req.user);
            if (!comment) return res.status(404).send('Not found')
            return res.status(200).send(comment)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async updateComment(req: Request<{ id: string }>, res: Response) {
        try {
            const commentToUpdate = await this.commentsQueryRepository.checkComment(req.params.id)
            if (!commentToUpdate) return res.sendStatus(404)
            if (commentToUpdate!.userId != req.user?.id) return res.sendStatus(403)
            const comment = await this.commentsQueryRepository.checkComment(req.params.id)
            if (comment) {
                const id = req.params.id;
                const content = req.body.content;
                const result = await this.commentsService.updateComment(id, content);
                if (result) return res.sendStatus(204)
                return res.sendStatus(404)
            }
            const errors = [];
            errors.push({message: 'Error commentId', field: 'commentId'})
            if (errors.length) {
                res.status(404).json({
                    errorsMessages: errors
                })
            }
            return
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async addLikeToComment(req: Request<{ id: string }, never, { likeStatus: string }, never>, res: Response) {
        try {
            const comment = await this.commentsQueryRepository.getComment(req.params.id, req.user)
            if (!comment) return res.sendStatus(404)
            const commentId = req.params.id;
            const userId = req.user.id;
            const login = req.user.accountData.userName;
            const {likeStatus} = req.body;
            await this.commentsService.addLikeToComment(commentId, userId, login, likeStatus)
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteComment(req: Request<{ id: string }>, res: Response) {
        try {
            const commentToDelete = await this.commentsQueryRepository.checkComment(req.params.id)
            if (!commentToDelete) return res.sendStatus(404)
            if (commentToDelete!.userId != req.user?.id) return res.sendStatus(403)
            const deleteCommentId = await this.commentsService.deleteComment(req.params.id)
            if (deleteCommentId) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}