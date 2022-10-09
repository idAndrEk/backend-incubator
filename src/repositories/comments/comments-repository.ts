import {CommentType, CreateCommentDto} from "../../types/commentsTypes";
import {CommentModelClass,} from "../db";
import {injectable} from "inversify";
import {SortDirection} from "../../types/paginationType";

@injectable()
export class CommentsRepository {

    async creteComment(newComment: CreateCommentDto): Promise<CommentType | null> {
        const comment = new CommentModelClass(newComment)
        await comment.save()
        return comment
        if (!comment) return null
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        const comment = await CommentModelClass.findByIdAndUpdate(id, {content})
        if (comment) return true
        return false
    }

    async deleteComment(id: string): Promise<boolean> {
        const deleteResult = await CommentModelClass.findByIdAndDelete(id)
        if (!deleteResult) return false
        return true
    }

    async countPostComment(postId: string | null) {
        const commentByPostCount = await CommentModelClass.countDocuments({postId})
        return commentByPostCount
    }

    async findPostComment(postId: string | null, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<CommentType[]> {
        const commentByPost = await CommentModelClass
            .find({postId})
            .skip((page - 1) * pageSize)
            .sort({[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1})
            .limit(pageSize)
            .lean()
        return commentByPost
    }
}