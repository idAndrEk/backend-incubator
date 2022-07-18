import {CommentResponseType} from "../types/CommentsTypes";
import {commentCollection} from "./db";
import {ObjectId} from "mongodb";


export const commentsRepository = {
    async findCommentId(id: string): Promise<CommentResponseType | null> {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: new Date().toString(),
        }
    }
}