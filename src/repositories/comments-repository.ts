import {CommentType, CreateCommentDto} from "../types/commentsTypes";
import {CommentModelClass,} from "./db";
import {injectable} from "inversify";
import {SortBy, SortDirection} from "../types/paginationType";

@injectable()
export class CommentsRepository {

    async findCommentId(id: string): Promise<CommentType | null> {
        // console.log(id)
        const comment = await CommentModelClass.findById({_id: id})
        return comment
    }

    async creteComment(newComment: CreateCommentDto): Promise<CommentType | null> {
        try {
            const comment =  new CommentModelClass(newComment)
            await comment.save()
            return comment
        } catch (e) {
            return null
        }
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        console.log(id)
        const comment = await CommentModelClass.findByIdAndUpdate({_id: id}, {content})
        if (comment) return true
        return false
    }

    async deleteComment(id: string): Promise<boolean> {
        const comment = await CommentModelClass.deleteOne({_id: id})
        if (comment) return true
        return false
    }

    async countPostComment(postId: string | null) {
        const commentByPostCount = await CommentModelClass.countDocuments({postId})
        return commentByPostCount
    }

    async findPostComment(postId: string | null, page: number, pageSize: number, sortBy: SortBy, sortDirection: SortDirection): Promise<CommentType[]> {
        const commentByPost = await CommentModelClass
            .find({postId})
            .skip((page - 1) * pageSize)
            .sort({[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1})
            .limit(pageSize)
            .lean()
        return commentByPost
    }
}