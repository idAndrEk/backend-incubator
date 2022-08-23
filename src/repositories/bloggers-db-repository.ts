import {promises} from "dns";
import {bloggersCollection, postCollection} from "./db";
import {Filter, ObjectId} from "mongodb";
import {BloggerPayloadType, BloggersResponseType, PaginationType} from "../types/bloggersTypes";
import {PostResponseType} from "../types/postsTypes";

export const bloggersRepository = {

    async allBloggers(page: number, pageSize: number, name: string | null): Promise<PaginationType<BloggersResponseType> | null> {
        let filter = {}
        if (name) {
            // console.log(name, 'name')
            filter = {name: {$regex: `.*${name}.*`}}
        }
        const skip = (page - 1) * pageSize
        let allBloggersCount = await bloggersCollection.countDocuments(filter)
        let pagesCount = allBloggersCount / pageSize
        let bloggers = await bloggersCollection.find(filter).skip(skip).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allBloggersCount,
            items: bloggers.map(blogger => ({
                youtubeUrl: blogger.youtubeUrl,
                id: blogger._id.toString(),
                name: blogger.name
            }))
        }
    },

    async findBloggerById(id: string): Promise<BloggersResponseType | null> {
        const blogger = await bloggersCollection.findOne({_id: new ObjectId(id)});
        if (!blogger) {
            return null
        }
        return {
            id: blogger._id.toString(),
            name: blogger.name,
            youtubeUrl: blogger.youtubeUrl
        }
    },

    async createBlogger(newBlogger: BloggerPayloadType): Promise<BloggersResponseType | null> {
        // async createBlogger(newBlogger: BloggersResponseType): Promise<BloggersResponseType | null> {
        const {
            youtubeUrl,
            name
        } = newBlogger
        const result = await bloggersCollection.insertOne(newBlogger);
        if (!result.acknowledged) {
            return null
        }
        return {
            name,
            youtubeUrl,
            id: result.insertedId.toString()
        }
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findBloggerPosts(bloggerId: string | null, page: number, pageSize: number): Promise<PaginationType<PostResponseType>> {
        let filter = {}
        if (bloggerId) {
            filter = {bloggerId}
        }
        const skip = (page - 1) * pageSize
        let allPostsCount = await postCollection.count(filter)
        let pagesCount = allPostsCount / pageSize
        let posts = await postCollection.find(filter).skip(skip).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allPostsCount,
            items: posts.map(post => ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName
            }))
        }
    }
}



