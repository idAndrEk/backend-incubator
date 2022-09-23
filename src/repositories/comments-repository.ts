import {CommentType} from "../types/CommentsTypes";
import {CommentModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async findCommentId(id: string): Promise<CommentType | null> {
        return CommentModelClass.findById(id)
    }

    async creteComment(newComment: CommentType): Promise<CommentType | null> {
        try {
            const comment = new CommentModelClass(newComment)
            return comment.save()
        } catch (e) {
            return null
        }
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        const comment = await CommentModelClass.updateOne({id}, {content})
        if (comment) return true
        return false
    }

    async deleteComment(id: string): Promise<boolean> {
        const comment = await CommentModelClass.deleteOne({id})
        if (comment) return true
        return false
    }
}