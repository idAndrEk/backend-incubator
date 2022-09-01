import {CommentType} from "../types/CommentsTypes";
import {commentCollection} from "./db";


export const commentsRepository = {
    async findCommentId(id: string): Promise<CommentType | null> {
        return await commentCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async creteComment(newComment: CommentType): Promise<boolean> {
        try {
            await commentCollection.insertOne(newComment)
            return true
        } catch (e) {
            return false
        }
    },

    async updateComment(id: string, content: string): Promise<boolean | null> {
        const result = await commentCollection.updateOne({id}, {
            $set: {
                content: content
            }
        })
        return result.matchedCount === 1
    },

    async deleteComment(id: string): Promise<boolean> {
        const result = await commentCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}