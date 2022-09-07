import {BloggerModel, PostModel} from "./db";
import {BloggerType} from "../types/bloggersTypes";
import {PostType} from "../types/postsTypes";

export const bloggersRepository = {
    async countBlogger(name: string | null) {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        const count = BloggerModel.countDocuments(filter)
        return count
    },

    async allBloggers(page: number, pageSize: number, name: string | null): Promise<BloggerType[]> {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        const blogger = BloggerModel
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        return blogger
    },

    async findBloggerById(id: string): Promise<BloggerType | null> {
        const blogger = BloggerModel.findById(id)
        return blogger
    },

    async createBlogger(newBlogger: BloggerType): Promise<BloggerType | null> {
        try {
            const blogger = new BloggerModel(newBlogger);
            return blogger.save()
        } catch (e) {
            return null
        }
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const blogger = await BloggerModel.findByIdAndUpdate(id, {name, youtubeUrl})
        if (blogger) return true
        return false
    },

    async deleteBlogger(id: string): Promise<boolean> {
        const blogger = await BloggerModel.findByIdAndDelete(id)
        if (blogger) return true
        return false
    },

    async countPostBlogger(bloggerId: string | null) {
        let filter = {}
        if (bloggerId) {
            filter = {$regex: bloggerId}
        }
        const count = PostModel.countDocuments(filter)
        return count
    },

    async findPostsBlogger(bloggerId: string | null, page: number, pageSize: number): Promise<PostType[]> {
        let filter = {}
        if (bloggerId) {
            filter = {$regex: bloggerId}
        }
        const postByBlogger = PostModel
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        return postByBlogger
    }
}



