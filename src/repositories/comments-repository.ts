import {CommentPayloadType, CommentResponseDBType, CommentResponseType} from "../types/CommentsTypes";
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

    async creteComment(newComment: CommentPayloadType): Promise<CommentResponseType | null> {
        const {
            content,
            userId,
            userLogin,
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

    async updateComment(id: string, content: string): Promise<boolean | null> {
        const result = await commentCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },

    async deleteComment(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}