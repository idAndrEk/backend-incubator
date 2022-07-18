import {CommentResponseType} from "../types/CommentsTypes";
import {commentsRepository} from "../repositories/comments-repository";


export const commentsService = {
    async findCommentId(id: string): Promise<CommentResponseType | null> {
        return await commentsRepository.findCommentId(id)
    }
}