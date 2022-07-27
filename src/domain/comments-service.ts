import {CommentResponseType} from "../types/CommentsTypes";
import {commentsRepository} from "../repositories/comments-repository";
import {UserDBPayloadType, UserResponseType} from "../types/UsersTypes";


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

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await commentsRepository.updateComment(id, content)
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}

// async createComment(postId: string, content: string, user: any): Promise<CommentResponseType | null> {
//     const newComment = {
//         content,
//         postId,
//         userId: user.id,
//         userLogin: user.login,
//         addedAt: new Date().toString()
//     }
//     const createComment = await commentsRepository.creteComment(newComment)
//     if (createComment) {
//         return createComment
//     }
//     return null
// },