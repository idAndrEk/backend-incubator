import {CommentType} from "../types/CommentsTypes";
import {CommentModel} from "./db";

export const commentsRepository = {
    async findCommentId(id: string): Promise<CommentType | null> {
        return CommentModel.findById(id)
    },

    async creteComment(newComment: CommentType): Promise<CommentType | null> {
        try {
            const comment = new CommentModel(newComment)
            return comment.save()
        } catch (e) {
            return null
        }
    },

    async updateComment(id: string, content: string): Promise<boolean | null> {
        const comment = await CommentModel.updateOne({id}, {content})
        if (comment) return true
        return false
    },

    async deleteComment(id: string): Promise<boolean> {
        const comment = await CommentModel.deleteOne({id})
        if (comment) return true
        return false
    }
}