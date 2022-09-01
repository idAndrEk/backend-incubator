import {bloggersCollection, postCollection} from "./db";
import {BloggerType} from "../types/bloggersTypes";
import {PostType} from "../types/postsTypes";

export const bloggersRepository = {
    async countBlogger(name: string | null) {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        return await bloggersCollection.countDocuments(filter)
    },

    async allBloggers(page: number, pageSize: number, name: string | null): Promise<BloggerType[]> {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        return bloggersCollection
            .find(filter, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    },

    async findBloggerById(id: string): Promise<BloggerType | null> {
        return await bloggersCollection.findOne({id}, {projection: {_id: 0}});
    },

    async createBlogger(newBlogger: BloggerType): Promise<boolean> {
        try {
            await bloggersCollection.insertOne({...newBlogger});
            return true
        } catch (e) {
            return false
        }
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async countPostBlogger(bloggerId: string | null) {
        let filter = {}
        if (bloggerId) {
            filter = {$regex: bloggerId}
        }
        return await bloggersCollection.countDocuments(filter)
    },

    async findPostsBlogger(bloggerId: string | null, page: number, pageSize: number): Promise<PostType[]> {
        let filter = {}
        if (bloggerId) {
            filter = {$regex: bloggerId}
        }
        return postCollection
            .find(filter, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    }
}



