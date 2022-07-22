import {CommentPayloadType, CommentResponseType} from "../types/CommentsTypes";
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
    },

    async creteComment(newComment: any /*CommentPayloadType*/): Promise<CommentResponseType | null> { //!!!!!!!!!!!
        const {
            content,
            userId,
            userLogin,
            addedAt
        } = newComment
        const result = await commentCollection.insertOne(newComment);
        if (!result.acknowledged) {
            return null
        }
        return {
            content,
            userId,
            userLogin,
            addedAt: new Date().toString(),
            id: result.insertedId.toString()
        }
    },

    async deleteComment(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}