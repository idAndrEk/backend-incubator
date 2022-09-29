import {CommentType, CreateCommentDto} from "../types/commentsTypes";
import {CommentModelClass, } from "./db";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async findCommentId(id: string): Promise<CommentType | null> {
        const comment = CommentModelClass.findById(id)
        return comment
    }

    async creteComment(newComment: CreateCommentDto): Promise<CommentType | null> {
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

    // async addLike(likeDb: LikeCommentCollectionType): Promise<boolean | null> {
    //     const updateLikeComment = await CommentModelClass.updateOne({'likesInfo.myStatus': likeDb.status})
    //     const addLikeCommentDB = await CommentLikeModelClass.create(likeDb)
    //     if (updateLikeComment && addLikeCommentDB) return true
    //     return false
    // }

    async deleteComment(id: string): Promise<boolean> {
        const comment = await CommentModelClass.deleteOne({id})
        if (comment) return true
        return false
    }
}