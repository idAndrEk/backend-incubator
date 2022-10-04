import {BloggerModelClass, PostModelClass} from "./db";
import {BloggerType, CreateBloggerDto} from "../types/bloggersTypes";
import {PostType} from "../types/postsTypes";
import {injectable} from "inversify";


//TODO: AWAIT
@injectable()
export class BloggersRepository {
    async countBlogger(name: string | null) {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        const countBlogger = BloggerModelClass.countDocuments(filter)
        return countBlogger
    }

    async getBloggers(page: number, pageSize: number, name: string | null): Promise<BloggerType[]> {
        let filter = {}
        if (name) {
            filter = {name: {$regex: `.*${name}.*`}}
        }
        const blogger = BloggerModelClass
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        // .lean()
        return blogger
    }

    async getBloggerById(id: string): Promise<BloggerType | null> {
        const blogger = BloggerModelClass.findById(id)
        return blogger
    }

    async createBlogger(newBlogger: CreateBloggerDto): Promise<BloggerType | null> {
        try {
            const bloggerInstance = new BloggerModelClass(newBlogger);
            return bloggerInstance.save()
        } catch (e) {
            return null
        }
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const updateResult = await BloggerModelClass.findByIdAndUpdate(id, {name, youtubeUrl})
        if (updateResult) return true
        return false
    }

    async deleteBlogger(id: string): Promise<boolean> {
        const deleteResult = await BloggerModelClass.findByIdAndDelete(id)
        if (deleteResult) return true
        return false
    }

    async countPostBlogger(bloggerId: string | null) {
        const bloggerPostsCount = PostModelClass.countDocuments({bloggerId})
        return bloggerPostsCount
    }

    async findPostsBlogger(bloggerId: string | null, page: number, pageSize: number): Promise<PostType[]> {
        const postByBlogger = PostModelClass
            .find({bloggerId})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
        return postByBlogger
    }
}


