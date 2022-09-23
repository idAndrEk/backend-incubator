import {CommentType} from "../types/CommentsTypes";
import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {}

    async findCommentId(id: string): Promise<CommentType | null> {
        return await this.commentsRepository.findCommentId(id)
    }

    async createComment(content: string, userId: string, userLogin: string, postId: string): Promise<CommentType | null> {
        const newComment = {
            _id: new ObjectId(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: new Date(),
            postId: postId
        }
        const isCommentCreate = await this.commentsRepository.creteComment(newComment)
        if (isCommentCreate) return newComment
        return null
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}


