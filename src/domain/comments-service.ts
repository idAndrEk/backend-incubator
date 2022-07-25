import {CommentResponseType} from "../types/CommentsTypes";
import {commentsRepository} from "../repositories/comments-repository";


export const commentsService = {
    async findCommentId(id: string): Promise<CommentResponseType | null> {
        return await commentsRepository.findCommentId(id)
    },

    async createComment(content: string, userId: string, userLogin: string) {
        const newComment = {
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: new Date().toString()
        }
        const createComment = await commentsRepository.creteComment(newComment)
        if (createComment) {
            return createComment
        }
        return null
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}