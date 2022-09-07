import {CommentType} from "../types/CommentsTypes";
import {commentsRepository} from "../repositories/comments-repository";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";


export const commentsService = {
    async findCommentId(id: string): Promise<CommentType | null> {
        return await commentsRepository.findCommentId(id)
    },

    async createComment(content: string, userId: string, userLogin: string, postId: string): Promise<CommentType | null> {
        const newComment = {
            _id: new ObjectId(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: new Date(),
            postId: postId
        }
        const isCommentCreate = await commentsRepository.creteComment(newComment)
        if (isCommentCreate) return newComment
        return null
    },

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}


