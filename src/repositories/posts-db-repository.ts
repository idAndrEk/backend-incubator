import {commentCollection, postCollection} from "./db";
import {PostType} from "../types/postsTypes";
import {PaginationType} from "../types/bloggersTypes";

export const postsRepositories = {
    async countPost(): Promise<number> {
        return await postCollection.countDocuments({})
    },

    async allPosts(page: number, pageSize: number): Promise<PostType[]> {
        return postCollection
            .find({}, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    },

    async findPostsId(id: string): Promise<PostType | null> {
        return await postCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createPost(newPost: PostType): Promise<boolean> {
        try {
            await postCollection.insertOne({...newPost})
            return true
        } catch (e) {
            return false
        }
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        const result = await postCollection.updateOne({id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async countPostComment(postId: string | null) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return await commentCollection.count(filter)
    },

    async findPostComment(postId: string | null, page: number, pageSize: number) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return commentCollection
            .find(filter, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    }
}


